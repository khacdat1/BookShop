import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse

class CF(object):
    """Collaborative Filtering"""
    def __init__(self, Y_data, k, dist_func=cosine_similarity, uuCF=1):
        self.uuCF = uuCF  # user-user (1) hoặc item-item (0) CF
        self.Y_data = Y_data if uuCF else Y_data[:, [1, 0, 2]]
        self.k = k
        self.dist_func = dist_func  # hàm đánh giá độ tương quan giữa 2 user
        self.Ybar_data = None  # bản sao của Y_data dùng để lưu ma trận normalize
        self.n_users = int(np.max(self.Y_data[:, 0])) + 1  # số lượng user
        self.n_items = int(np.max(self.Y_data[:, 1])) + 1  # số lượng item

    def add(self, new_data):
        self.Y_data = np.concatenate((self.Y_data, new_data), axis=0)

    def normalize_Y(self):
        users = self.Y_data[:, 0]
        self.Ybar_data = self.Y_data.copy()
        self.mu = np.zeros((self.n_users,))

        for n in range(self.n_users):
            ids = np.where(users == n)[0].astype(np.int32)
            ratings = self.Y_data[ids, 2]
            m = np.mean(ratings) if ratings.size > 0 else 0
            if np.isnan(m):
                m = 0
            self.mu[n] = m
            self.Ybar_data[ids, 2] = ratings - self.mu[n] + 0.01
        self.Ybar = sparse.coo_matrix((self.Ybar_data[:, 2],
                                       (self.Ybar_data[:, 1], self.Ybar_data[:, 0])),
                                      (self.n_items, self.n_users)).tocsr()

    def similarity(self, u):
        eps = 1e-6
        sim = self.dist_func(self.Ybar.T[u], self.Ybar.T).flatten()
        sim[np.isnan(sim)] = 0
        sim = np.clip(sim, eps, 1-eps)
        return sim

    def refresh(self):
        self.normalize_Y()

    def fit(self):
        self.refresh()

    def __pred(self, u, i, normalized=1):
        ids = np.where(self.Y_data[:, 1] == i)[0].astype(np.int32)
        users_rated_i = (self.Y_data[ids, 0]).astype(np.int32)
        if len(users_rated_i) != 0:
            sim = self.similarity(u)
            sim = sim[users_rated_i]
            a = np.argsort(sim)[-self.k:]
            c = users_rated_i[a]
            nearest_s = sim[a]
            r = self.Ybar[i, users_rated_i[a]]
            if normalized:
                Z = (r*nearest_s)[0]/(np.abs(nearest_s).sum() + 1e-8)
                return Z, c
            return Z, c
        else:
            return 0, 0

    def pred(self, u, i, normalized=1):
        if self.uuCF:
            return self.__pred(u, i, normalized)
        return self.__pred(i, u, normalized)

    def recommend(self, u):
        ids = np.where(self.Y_data[:, 0] == u)[0]
        items_rated_by_u = self.Y_data[ids, 1].tolist()
        recommended_items = []
        for i in range(self.n_items):
            if i not in items_rated_by_u:
                rating, c = self.__pred(u, i)
                if rating > 0:
                    recommended_items.append([rating, i, c])
        sorted_list = sorted(recommended_items, reverse=True)
        top_items = sorted_list[:20]
        item_ids = [i[1] for i in top_items]
        neighbors = [i[2] for i in top_items]
        return item_ids, neighbors
