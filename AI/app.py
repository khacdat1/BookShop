import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import ast
from flask import Flask,render_template,request,redirect,jsonify
from flask_cors import CORS
import pickle
import pyodbc
import random
import requests
import math
import os
import shutil
import joblib
from pymongo import MongoClient
class CF(object):
    """docstring for CF"""
    def __init__(self, Y_data, k, dist_func = cosine_similarity, uuCF = 1):
        self.uuCF = uuCF # user-user (1) or item-item (0) CF
        self.Y_data = Y_data if uuCF else Y_data[:, [1, 0, 2]]
        self.k = k
        self.dist_func = dist_func # đánh giá độ tương quan giữ 2 user
        self.Ybar_data = None # bản sao của ydata dùng để lưu ma trận nornalize
        # number of users and items. Remember to add 1 since id starts from 0
        self.n_users = int(np.max(self.Y_data[:, 0])) + 1 # số lượng User
        self.n_items = int(np.max(self.Y_data[:, 1])) + 1 # số lượng Item
    def add(self, new_data):
        """
        Update Y_data matrix when new ratings come.
        For simplicity, suppose that there is no new user or item.
        """
        self.Y_data = np.concatenate((self.Y_data, new_data), axis = 0)

    def normalize_Y(self):
        users = self.Y_data[:, 0] # all users - first col of the Y_data
        self.Ybar_data = self.Y_data.copy()
        self.mu = np.zeros((self.n_users,)) # lư

        for n in range(self.n_users):
            # row indices of rating done by user n
            # since indices need to be integers, we need to convert
            ids = np.where(users == n)[0].astype(np.int32)
            # indices of all ratings associated with user n
            item_ids = self.Y_data[ids, 1]
            # and the corresponding ratings
            ratings = self.Y_data[ids, 2]
            # take mean
            m = np.mean(ratings)
            if np.isnan(m):
                m = 0 # to avoid empty array and nan value
            self.mu[n] = m
            # normalize
            self.Ybar_data[ids, 2] = ratings - self.mu[n] + 0.01
        self.Ybar = sparse.coo_matrix((self.Ybar_data[:, 2],
            (self.Ybar_data[:, 1], self.Ybar_data[:, 0])), (self.n_items, self.n_users))

        self.Ybar = self.Ybar.tocsr()

    def similarity(self):
        eps = 1e-6
        self.S = self.dist_func(self.Ybar.T, self.Ybar.T)

    def refresh(self):
        """
        Normalize data and calculate similarity matrix again (after
        some few ratings added)
        """
        self.normalize_Y()
        self.similarity()
        print('Y_data: ',self.Y_data)


    def fit(self):
        self.refresh()


    def __pred(self, u, i, normalized = 1):
        """
        predict the rating of user u for item i (normalized)
        if you need the un
        """
        # Step 1: find all users who rated i
        ids = np.where(self.Y_data[:, 1] == i)[0].astype(np.int32) # vi tri user danh gia item
        # Step 2:
        users_rated_i = (self.Y_data[ids, 0]).astype(np.int32)
        # Step 3: find similarity btw the current user and others
        # who already rated i

        if len(users_rated_i) != 0:
          sim = self.S[u, users_rated_i] # matran similarity
          sim = sim + 0.01
          # Step 4: find the k most similarity users
          a = np.argsort(sim)[-self.k:]
          c = users_rated_i[a]
          # and the corresponding similarity levels
          nearest_s = sim[a]
          #print('users_rated_i[a]',users_rated_i[a])
          # How did each of 'near' users rated item i
          r = self.Ybar[i, users_rated_i[a]]
          if normalized:
              # add a small number, for instance, 1e-8, to avoid dividing by 0
              Z = (r*nearest_s)[0]/(np.abs(nearest_s).sum() + 1e-8)
              return Z,c
          return Z,c
        else:
          return 0,0

    def pred(self, u, i, normalized = 1):
        """
        predict the rating of user u for item i (normalized)
        if you need the un
        """
        if self.uuCF: return self.__pred(u, i, normalized)
        return self.__pred(i, u, normalized)


    def recommend(self, u):
        """
        Determine all items should be recommended for user u.
        The decision is made based on all i such that:
        self.pred(u, i) > 0. Suppose we are considering items which
        have not been rated by u yet.
        """
        ids = np.where(self.Y_data[:, 0] == u)[0]
        items_rated_by_u = self.Y_data[ids, 1].tolist()
        recommended_items = []
        for i in range(self.n_items):
            if i not in items_rated_by_u:
                rating,c = self.__pred(u, i)
                if rating > 0:
                    recommended_items.append([rating,i,c])
        sorted_list = sorted(recommended_items, reverse=True)
        four_lines = sorted_list[:20]
        arr1 = []
        arr2 = []
        for i in four_lines:
          arr1.append(i[1])
          arr2.append(i[2])
        #four_lines_last_column = [row[-1] for row in four_lines]
        return arr1,arr2
    
app = Flask(__name__)

CORS(app)

MONGO_URI = "mongodb+srv://khacdat1:Khacnguyen%401@datn.r6t7owf.mongodb.net/DATN?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)  # Sử dụng chuỗi kết nối MongoDB của bạn

# Đảm bảo thay 'ten_database_cua_ban' bằng tên cơ sở dữ liệu bạn đang sử dụng
db = client['DATN']  # Tên database, thay bằng tên cơ sở dữ liệu của bạn
collection = db['comments'] 

@app.route("/recommend")
def member():
    loaded_model = joblib.load('model.pkl')
    print('loaded_model: ', loaded_model)
    memberId = request.args.get('id')
    print('memberId: ', memberId)
    id = int(memberId)
    bookListId,userListId = loaded_model.recommend(id)
    return bookListId

@app.route("/add-rating", methods=["POST"])
def add_rating():
    try:
        # Tải mô hình hiện tại
        loaded_model = joblib.load('model.pkl')
        
        # Lấy đánh giá mới từ yêu cầu
        data = request.get_json()
        rating = data.get('data')
        
        if not rating or not isinstance(rating, list) or len(rating) != 3:
            return jsonify({"error": "Dữ liệu không hợp lệ"}), 400
        
        # Thêm đánh giá mới vào MongoDB
        new_rating = {
            "id_user": rating[0],
            "id_book": rating[1],
            "rating": rating[2]
        }
        collection.insert_one(new_rating)
        
        # Lấy tất cả các đánh giá từ MongoDB
        all_ratings = list(collection.find({}, {"_id": 0, "id_user": 1, "id_book": 1, "rating": 1}))
        Y_data = np.array([[r["id_user"], r["id_book"], r["rating"]] for r in all_ratings])
        
        # Cập nhật mô hình với các đánh giá mới
        loaded_model.Y_data = Y_data
        loaded_model.fit()
        
        # Lưu mô hình đã cập nhật
        joblib.dump(loaded_model, 'model.pkl')
        
        response = {"message": "Đã thêm đánh giá thành công", "data": rating}
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    app.run(debug=True)