import pandas as pd
from cf_recommender import CF

# Đọc dữ liệu từ file CSV
ratings_base = pd.read_csv('comments.csv')
ratings_base = ratings_base[['customer_id', 'product_id', 'rating']]
rate_train = ratings_base.values

# Khởi tạo mô hình CF
rs = CF(rate_train, k=10, uuCF=1)
rs.fit()

# Gợi ý cho người dùng cụ thể
u = 588
recommended_items, neighbors = rs.recommend(u)

print("Các mặt hàng được gợi ý:", recommended_items)
print("Các hàng xóm ảnh hưởng đến gợi ý:", neighbors)
