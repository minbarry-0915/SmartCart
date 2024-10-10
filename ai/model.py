import pymysql
import pandas as pd
from gensim.models import Word2Vec
from sklearn.model_selection import train_test_split, GridSearchCV, KFold
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import numpy as np
import pickle
import matplotlib.pyplot as plt
import seaborn as sns
from xgboost import XGBRegressor

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
users = pd.read_sql("SELECT * FROM User3", conn)
products = pd.read_sql("SELECT * FROM Product3", conn)
orders = pd.read_sql("SELECT * FROM Orders", conn)
order_items = pd.read_sql("SELECT * FROM Order_Item", conn)

conn.close()

# 데이터 타입을 문자열로 변환하여 병합 오류 방지
users['Userid'] = users['Userid'].astype(str)
products['Product_id'] = products['Product_id'].astype(str)
order_items['Product_id'] = order_items['Product_id'].astype(str)
orders['Order_id'] = orders['Order_id'].astype(str)
order_items['Order_id'] = order_items['Order_id'].astype(str)

# 1. 데이터 준비: Orders와 Order_Item 테이블 결합하여 구매 기록 생성
purchase_history = pd.merge(order_items, orders, on='Order_id', how='left')
purchase_history = pd.merge(purchase_history, users, on='Userid', how='left')
purchase_history = pd.merge(purchase_history, products, on='Product_id', how='left')

# 병합된 데이터 확인
#print(purchase_history.columns)

# 2. 구매 기록을 Training Set과 Test Set으로 분할
train_set, test_set = train_test_split(purchase_history, test_size=0.3, random_state=42)

# 열 이름 공백이나 특수문자 제거
train_set.columns = train_set.columns.str.strip()
test_set.columns = test_set.columns.str.strip()

# 학습에 불필요한 열을 제거 (Userid, Order_id, Product_id, Order_date는 유지)
columns_to_drop = ['Tag', 'Payment_card', 'Payment_card_num', 
                   'Name', 'Phone_num', 'Email', 'Password', 'Main_image', 'Description']

# 각 열을 개별적으로 제거
for column in columns_to_drop:
    if column in train_set.columns:
        train_set = train_set.drop(column, axis=1)
        print(f"Column {column} removed from train_set")
    else:
        print(f"Column {column} not found in train_set")

# 불필요한 열 제거 (열이 없을 경우 무시하도록 'errors' 옵션 추가)
train_set_cleaned = train_set.drop(columns=columns_to_drop, errors='ignore')
test_set_cleaned = test_set.drop(columns=columns_to_drop, errors='ignore')

# 3. Word2Vec을 이용하여 상품 임베딩 생성
purchase_sequences = train_set_cleaned.groupby('Userid')['Product_id'].apply(lambda x: list(map(str, x)))
w2v_model = Word2Vec(sentences=purchase_sequences, vector_size=100, window=5, min_count=1, sg=1)

# Word2Vec 모델 저장
w2v_model.save("w2v_model.pkl")

# 상품 간의 유사도를 구하기 위해 각 상품의 벡터를 얻음
def get_product_vector(product_id):
    return w2v_model.wv[str(product_id)] if str(product_id) in w2v_model.wv else np.zeros(100)

# 4. 추가 피처 결합: User3 및 Product3 정보
# User3 정보: Birthdate, Gender
label_encoder = LabelEncoder()
users['Gender'] = label_encoder.fit_transform(users['Gender'])

# Product3 정보: Category, Price
one_hot_encoder = OneHotEncoder(sparse_output=False)
category_encoded = one_hot_encoder.fit_transform(products[['Category']])
category_encoded_df = pd.DataFrame(category_encoded, columns=one_hot_encoder.get_feature_names_out(['Category']))
products = pd.concat([products, category_encoded_df], axis=1)

# 5. Training Set에 User3, Product3 정보 병합
train_set_cleaned = pd.merge(train_set_cleaned, users[['Userid', 'Birthdate', 'Gender']], on='Userid', how='left')
train_set_cleaned = pd.merge(train_set_cleaned, products, on='Product_id', how='left')

# y 컬럼을 사용하고 x 컬럼은 삭제
train_set_cleaned.rename(columns={
    'Price_y': 'Price', 
    'Discount_y': 'Discount',
    'Gender_y': 'Gender'
}, inplace=True)

# x 컬럼 삭제
train_set_cleaned.drop(columns=['Price_x', 'Discount_x', 'Gender_x'], inplace=True)

# 상품 벡터 추가
train_set_cleaned['Product_Vector'] = train_set_cleaned['Product_id'].apply(get_product_vector)

# 병합된 데이터에서 'Gender', 'Price', 'Discount'가 수치형으로 변환되었는지 확인
train_set_cleaned['Price'] = train_set_cleaned['Price'].astype(float)
train_set_cleaned['Discount'] = train_set_cleaned['Discount'].astype(float)

# 6. 피처 준비
X_train = np.hstack([
    np.stack(train_set_cleaned['Product_Vector'].values),  # 상품 임베딩 벡터
    train_set_cleaned[['Gender', 'Price', 'Discount']].values,  # 추가 피처: 성별, 가격, 할인
    train_set_cleaned[category_encoded_df.columns].values  # 카테고리 원핫 인코딩
])
y_train = train_set_cleaned['Quantity'].values

# 7. 단일 모델 학습 및 성능 평가
models = {
    'RandomForest': RandomForestRegressor(n_estimators=200, max_depth=5, min_samples_leaf=4, min_samples_split=5, random_state=42),
    'GradientBoosting': GradientBoostingRegressor(n_estimators=100, learning_rate=0.01, max_depth=3, random_state=42),
    'XGBRegressor': XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=3, random_state=42)
}

# 각 모델에 대한 성능 평가
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_train)
    mse = mean_squared_error(y_train, y_pred)
    print(f"{name} - MSE: {mse}")

# 테스트 세트 준비
test_set_cleaned = pd.merge(test_set_cleaned, users[['Userid', 'Birthdate', 'Gender']], on='Userid', how='left')
test_set_cleaned = pd.merge(test_set_cleaned, products, on='Product_id', how='left')
test_set_cleaned['Product_Vector'] = test_set_cleaned['Product_id'].apply(get_product_vector)

# y 컬럼을 사용하고 x 컬럼은 삭제 (테스트 세트 버전)
test_set_cleaned.rename(columns={
    'Price_y': 'Price', 
    'Discount_y': 'Discount',
    'Gender_y': 'Gender'
}, inplace=True)

# x 컬럼 삭제 (테스트 세트 버전)
test_set_cleaned.drop(columns=['Price_x', 'Discount_x', 'Gender_x'], inplace=True, errors='ignore')

# 피처 준비 (테스트 세트 버전)
X_test = np.hstack([
    np.stack(test_set_cleaned['Product_Vector'].values),  # 상품 임베딩 벡터
    test_set_cleaned[['Gender', 'Price', 'Discount']].values,  # 추가 피처: 성별, 가격, 할인
    test_set_cleaned[category_encoded_df.columns].values  # 카테고리 원핫 인코딩
])
y_test = test_set_cleaned['Quantity'].values


# 테스트 세트에 대한 모델 성능 평가
for name, model in models.items():
    y_test_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_test_pred)
    print(f"{name} (Test Set) - MSE: {mse}")

# 8. 스태킹 앙상블 모델 구성 및 학습
base_models = [
    ('rf', models['RandomForest']),
    ('gb', models['GradientBoosting']),
    ('xgb', models['XGBRegressor'])
]

# 메타 모델 (Ridge Regression)
meta_model = Ridge(alpha=1.0)

# 스태킹 앙상블 구성
stacking_model = StackingRegressor(estimators=base_models, final_estimator=meta_model, cv=5, n_jobs=-1)

# 모델 학습
stacking_model.fit(X_train, y_train)

# 스태킹 앙상블 예측 및 성능 평가
y_train_pred = stacking_model.predict(X_train)
stacking_mse = mean_squared_error(y_train, y_train_pred)
print(f"Stacking Model - MSE: {stacking_mse}")

y_test_pred = stacking_model.predict(X_test)
test_mse = mean_squared_error(y_test, y_test_pred)
print(f"Stacking Model (Test Set) - MSE: {test_mse}")

# 모델 저장
with open('stacking_model_optimized.pkl', 'wb') as f:
    pickle.dump(stacking_model, f)

# 9. 제품 추천 함수
def recommend_for_user(user_id, top_n=10):
    # 사용자의 구매 내역 가져오기
    user_purchases = purchase_history[purchase_history['Userid'] == user_id]['Product_id'].tolist()
    
    # 사용자 존재 여부 확인
    if user_id not in users['Userid'].values:
        print(f"Error: User {user_id} not found.")
        return None
    
    all_products = products['Product_id'].tolist()
    products_to_score = [p for p in all_products if p not in user_purchases]
    
    # 제품들에 대한 예측 점수
    product_vectors = np.array([get_product_vector(p) for p in products_to_score])
    user_info = users[users['Userid'] == user_id][['Gender']].values  # 성별 정보만 사용
    product_info = products[products['Product_id'].isin(products_to_score)][['Price', 'Discount']].values
    category_info = products[products['Product_id'].isin(products_to_score)][category_encoded_df.columns].values

    # 각 배열의 크기 확인
    print(f"Product vectors shape: {product_vectors.shape}")
    print(f"User info shape: {user_info.shape}")
    print(f"Product info shape: {product_info.shape}")
    print(f"Category info shape: {category_info.shape}")
    
    # 배열이 비어있지 않을 때만 결합
    if product_vectors.size > 0 and user_info.size > 0 and product_info.size > 0 and category_info.size > 0:
        X_recommend = np.hstack([
            product_vectors,
            np.repeat(user_info, len(products_to_score), axis=0),
            product_info,
            category_info
        ])
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
print(f"User {user_id}의 추천 상품 (JSON 형식): {recommendations_json}")

# 10. 잔차 분석 및 시각화
residuals = y_train - stacking_model.predict(X_train)

# 잔차 히스토그램
plt.figure(figsize=(10,6))
sns.histplot(residuals, kde=True, color="green")
plt.title("Residuals Distribution")
plt.xlabel("Residuals")
plt.ylabel("Frequency")
plt.show()

# 잔차 플롯 (Residuals vs Predicted Values)
plt.scatter(stacking_model.predict(X_train), residuals, color="blue", alpha=0.5)
plt.axhline(0, color='red', linestyle='--')
plt.title("Residuals vs Predicted Values")
plt.xlabel("Predicted Quantity")
plt.ylabel("Residuals")
plt.show()

# 11. Baseline 모델과 비교
baseline_pred = np.full_like(y_test, y_train.mean())
baseline_mse = mean_squared_error(y_test, baseline_pred)
print(f"Baseline Model MSE: {baseline_mse}")
print(f"Stacking Model (Test Set) MSE: {test_mse}")
