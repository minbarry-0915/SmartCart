import pandas as pd
import numpy as np
import pickle
import pymysql
from sklearn.preprocessing import LabelEncoder
import os
from dotenv import load_dotenv
import sys
import io
from sqlalchemy import create_engine  # SQLAlchemy에서 create_engine을 임포트

# .env 파일의 환경 변수 로드
load_dotenv()

# 환경 변수 사용
MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_USERNAME = os.getenv('MYSQL_USERNAME')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_PORT = os.getenv('MYSQL_PORT')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')

# SQLAlchemy를 사용하여 MariaDB 연결 설정
db_url = f"mysql+pymysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
engine = create_engine(db_url)


# 파이썬 기본 출력 인코딩 설정
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

# .env 파일의 환경 변수 로드
load_dotenv()

# 환경 변수 사용
MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_USERNAME = os.getenv('MYSQL_USERNAME')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_PORT = os.getenv('MYSQL_PORT')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')

# SQLAlchemy를 사용하여 MariaDB 연결 설정
db_url = f"mysql+pymysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
engine = create_engine(db_url)

# ai 폴더 내의 stacking_model_optimized.pkl 파일 로드
model_path = os.path.join(os.path.dirname(__file__), 'stacking_model_optimized.pkl')
with open(model_path, 'rb') as f:
    stacking_model = pickle.load(f)

# 저장된 Word2Vec 모델 로드
w2v_model_path = os.path.join(os.path.dirname(__file__), 'w2v_model.pkl')
with open(w2v_model_path, 'rb') as f:
    w2v_model = pickle.load(f)

# 각 테이블 로드 (SQLAlchemy 엔진을 사용)
users = pd.read_sql("SELECT * FROM User3", engine)
products = pd.read_sql("SELECT * FROM Product3", engine)
orders = pd.read_sql("SELECT * FROM Orders", engine)
order_items = pd.read_sql("SELECT * FROM Order_Item", engine)

# 데이터 타입을 문자열로 변환하여 병합 오류 방지
users['Userid'] = users['Userid'].astype(str)
products['Product_id'] = products['Product_id'].astype(str)
order_items['Product_id'] = order_items['Product_id'].astype(str)
orders['Order_id'] = orders['Order_id'].astype(str)
order_items['Order_id'] = order_items['Order_id'].astype(str)

# Gender 값 인코딩 (Female -> 0, Male -> 1)
label_encoder = LabelEncoder()
users['Gender'] = label_encoder.fit_transform(users['Gender'])  # Female -> 0, Male -> 1

# 1. 데이터 준비: Orders와 Order_Item 테이블 결합하여 구매 기록 생성
purchase_history = pd.merge(order_items, orders, on='Order_id', how='left')
purchase_history = pd.merge(purchase_history, users, on='Userid', how='left')
purchase_history = pd.merge(purchase_history, products, on='Product_id', how='left')

# 상품 간의 유사도를 구하기 위해 각 상품의 벡터를 얻음
def get_product_vector(product_id):
    return w2v_model.wv[str(product_id)] if str(product_id) in w2v_model.wv else np.zeros(100)

# 범주형 데이터 인코딩
category_encoded_df = pd.get_dummies(products['Category'], prefix='Category')

# 원핫 인코딩된 카테고리를 products에 병합
products = pd.concat([products, category_encoded_df], axis=1)

# 제품 추천 함수
def recommend_for_user(user_id, top_n=10):
    # 사용자의 구매 내역 가져오기
    user_purchases = purchase_history[purchase_history['Userid'] == user_id]['Product_id'].tolist()

    # 사용자 존재 여부 확인
    if user_id not in users['Userid'].values:
        print(f"Error: User {user_id} not found.")
        return None

    all_products = products['Product_id'].tolist()
    products_to_score = [p for p in all_products if p not in user_purchases]

    # Word2Vec으로 제품 벡터 생성
    product_vectors = np.array([get_product_vector(p) for p in products_to_score])
    user_info = users[users['Userid'] == user_id][['Gender']].values  # 성별 정보만 사용
    product_info = products[products['Product_id'].isin(products_to_score)][['Price', 'Discount']].values

    # category_encoded_df.columns의 열이 products에 있는지 확인하고, 없을 경우를 대비해 에러 방지
    category_columns = [col for col in category_encoded_df.columns if col in products.columns]

    if len(category_columns) == 0:
        print("Error: No matching category columns found in products.")
        return None

    category_info = products[products['Product_id'].isin(products_to_score)][category_columns].values

    # 배열이 비어있지 않을 때만 결합
    if product_vectors.size > 0 and user_info.size > 0 and product_info.size > 0 and category_info.size > 0:
        X_recommend = np.hstack([product_vectors, np.repeat(user_info, len(products_to_score), axis=0), product_info, category_info])
    else:
        print("Error: One or more arrays are empty.")
        return None

    # 예측 점수 계산
    scores = stacking_model.predict(X_recommend)

    # 상위 N개의 추천 제품
    top_indices = np.argsort(scores)[-top_n:][::-1]
    top_products = [products_to_score[i] for i in top_indices]

    # 추천된 제품의 전체 정보(Product3 테이블) JSON 형식으로 반환
    recommended_products = products[products['Product_id'].isin(top_products)]
    return recommended_products.to_json(orient='records', force_ascii=False)

# 예시: 특정 사용자에게 10개의 제품을 추천
user_id = '123'  # 추천을 요청할 Userid
recommendations_json = recommend_for_user(user_id)

# Python 스크립트 실행 결과로 JSON만 출력
print(recommendations_json)
