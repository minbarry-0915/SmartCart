import pickle
import numpy as np
import pandas as pd
from gensim.models import Word2Vec
import pymysql
from sklearn.preprocessing import OneHotEncoder, LabelEncoder

# 데이터 로드 (MariaDB에서 데이터 로드 예시)
def load_data():
    # MariaDB 연결 설정
    conn = pymysql.connect(
        host='113.198.137.97',
        user='guest',
        password='1234',
        port=6151,
        database='SmartCart',
        charset='utf8'
    )

    # 각 테이블 로드
    users = pd.read_sql("SELECT * FROM User2", conn)
    products = pd.read_sql("SELECT * FROM Product2", conn)
    purchase_history = pd.read_sql("SELECT * FROM Purchase_History2", conn)
    
    conn.close()
    
    return users, products, purchase_history

# Word2Vec 모델 및 피처 준비
def prepare_data(purchase_history, products):
    purchase_sequences = purchase_history.groupby('User_id')['Product_id'].apply(list)
    w2v_model = Word2Vec(sentences=purchase_sequences, vector_size=100, window=5, min_count=1, sg=1)

    # 상품 벡터 생성 함수
    def get_product_vector(product_id):
        return w2v_model.wv[product_id] if product_id in w2v_model.wv else np.zeros(100)

    # One-Hot Encoding for categories
    one_hot_encoder = OneHotEncoder(sparse_output=False)
    category_encoded = one_hot_encoder.fit_transform(products[['Category']])
    category_encoded_df = pd.DataFrame(category_encoded, columns=one_hot_encoder.get_feature_names_out(['Category']))

    # One-Hot Encoding 된 카테고리를 products 데이터프레임에 병합
    products_with_categories = pd.concat([products.reset_index(drop=True), category_encoded_df], axis=1)

    return get_product_vector, products_with_categories, category_encoded_df

# 저장된 모델 불러오기
def load_models():
    with open('random_forest_model.pkl', 'rb') as rf_file:
        loaded_rf_model = pickle.load(rf_file)

    with open('gradient_boosting_model.pkl', 'rb') as gb_file:
        loaded_gb_model = pickle.load(gb_file)
    
    return loaded_rf_model, loaded_gb_model

# 앙상블 예측 함수
def ensemble_predict(X, rf_model, gb_model):
    rf_preds = rf_model.predict(X)
    gb_preds = gb_model.predict(X)
    return (rf_preds + gb_preds) / 2  # 앙상블 예측 (평균)

# 특정 사용자에 대한 추천 함수
def recommend_for_user(user_id, top_n=10):
    # 사용자의 구매 데이터와 상품 데이터를 준비하는 로직
    user_purchases = purchase_history[purchase_history['User_id'] == user_id]['Product_id'].tolist()
    all_products = products['Product_id'].tolist()
    products_to_score = [p for p in all_products if p not in user_purchases]
    
    # Label Encoding for Gender (Female -> 0, Male -> 1)
    label_encoder = LabelEncoder()
    users['Gender'] = label_encoder.fit_transform(users['Gender'])  # Gender를 수치형으로 변환

    # 제품들에 대한 예측 점수 계산
    product_vectors = np.array([get_product_vector(p) for p in products_to_score])
    user_info = users[users['User_id'] == user_id][['Age', 'Gender']].values
    product_info = products[products['Product_id'].isin(products_to_score)][['Price']].values
    category_info = products_with_categories[products_with_categories['Product_id'].isin(products_to_score)][category_encoded_df.columns].values

    # 사용자의 정보와 제품 데이터를 결합하여 예측 수행
    X_recommend = np.hstack([
        product_vectors,
        np.repeat(user_info, len(products_to_score), axis=0),
        product_info,
        category_info
    ])
    
    # 저장된 모델 로드
    rf_model, gb_model = load_models()

    # 앙상블 예측
    scores = ensemble_predict(X_recommend, rf_model, gb_model)
    
    # 상위 N개의 추천 제품 선택
    top_indices = np.argsort(scores)[-top_n:][::-1]
    top_products = [products_to_score[i] for i in top_indices]
    
    # 추천된 제품의 전체 정보(JSON 형식으로 변환)
    recommended_products = products[products['Product_id'].isin(top_products)]
    return recommended_products.to_json(orient='records', force_ascii=False)

# 메인 실행 로직
if __name__ == "__main__":
    # 데이터 로드
    users, products, purchase_history = load_data()

    # Word2Vec 및 피처 준비
    get_product_vector, products_with_categories, category_encoded_df = prepare_data(purchase_history, products)

    # 예시: User_id 1에 대한 추천
    user_id = 2
    recommendations_json = recommend_for_user(user_id)
    print(f"User {user_id}의 추천 상품 (JSON 형식): {recommendations_json}")
