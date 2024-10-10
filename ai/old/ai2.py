import pymysql
import pandas as pd
from gensim.models import Word2Vec
from sklearn.model_selection import train_test_split, GridSearchCV, KFold
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import numpy as np
import json
import pickle
import matplotlib.pyplot as plt
import seaborn as sns

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

# 1. 구매 기록을 Training Set과 Test Set으로 분할
train_set, test_set = train_test_split(purchase_history, test_size=0.3, random_state=42)

# 2. Word2Vec을 이용하여 상품 임베딩 생성
purchase_sequences = train_set.groupby('User_id')['Product_id'].apply(list)
w2v_model = Word2Vec(sentences=purchase_sequences, vector_size=100, window=5, min_count=1, sg=1)

# 상품 간의 유사도를 구하기 위해 각 상품의 벡터를 얻음
def get_product_vector(product_id):
    return w2v_model.wv[product_id] if product_id in w2v_model.wv else np.zeros(100)

# 3. 추가 피처 결합: User2 및 Product2 정보
# User2 정보: Age, Gender
# 범주형 데이터인 Gender를 숫자형으로 인코딩
label_encoder = LabelEncoder()
users['Gender'] = label_encoder.fit_transform(users['Gender'])

# Product2 정보: Category, Price
# 범주형 데이터인 Category를 One-Hot 인코딩
one_hot_encoder = OneHotEncoder(sparse_output=False)
category_encoded = one_hot_encoder.fit_transform(products[['Category']])
category_encoded_df = pd.DataFrame(category_encoded, columns=one_hot_encoder.get_feature_names_out(['Category']))
products = pd.concat([products, category_encoded_df], axis=1)

# 4. Training Set에 User2, Product2 정보 병합
train_set = pd.merge(train_set, users[['User_id', 'Age', 'Gender']], on='User_id', how='left')
train_set = pd.merge(train_set, products, on='Product_id', how='left')

# 상품 벡터 추가
train_set['Product_Vector'] = train_set['Product_id'].apply(get_product_vector)

# 5. 피처 준비
X_train = np.hstack([
    np.stack(train_set['Product_Vector'].values),  # 상품 임베딩 벡터
    train_set[['Age', 'Gender', 'Price']].values,  # 추가 피처: 연령대, 성별, 가격
    train_set[category_encoded_df.columns].values  # 추가 피처: 카테고리
])
y_train = train_set['Quantity'].values

# 6. 회귀 모델 학습
models = {
    'LinearRegression': LinearRegression(),
    'RandomForest': RandomForestRegressor(random_state=42),
    'GradientBoosting': GradientBoostingRegressor(random_state=42)
}

# RandomForest 하이퍼파라미터 튜닝 (과적합 방지를 위한 수정된 파라미터)
rf_params = {
    'n_estimators': [100, 200],
    'max_depth': [5, 10],  # 깊이를 제한하여 과적합 방지
    'min_samples_split': [5, 10],  # 노드 분할 시 더 많은 샘플 요구
    'min_samples_leaf': [2, 4],  # 리프 노드에 더 많은 샘플 요구
    'bootstrap': [True]  # 부트스트랩 샘플링 사용
}

rf_grid_search = GridSearchCV(models['RandomForest'], rf_params, cv=3, scoring='neg_mean_squared_error', n_jobs=-1)
rf_grid_search.fit(X_train, y_train)

# 최적의 RandomForest 하이퍼파라미터
best_rf_model = rf_grid_search.best_estimator_
print(f"RandomForest Best Params: {rf_grid_search.best_params_}")

# 모델 저장 (학습이 완료된 후 모델을 저장하는 코드 추가)
with open('random_forest_model.pkl', 'wb') as rf_file:
    pickle.dump(best_rf_model, rf_file)

# GradientBoosting 하이퍼파라미터 튜닝
gb_params = {
    'n_estimators': [100, 200],
    'learning_rate': [0.01, 0.1],
    'max_depth': [3, 5]
}

gb_grid_search = GridSearchCV(models['GradientBoosting'], gb_params, cv=3, scoring='neg_mean_squared_error', n_jobs=-1)
gb_grid_search.fit(X_train, y_train)

# 최적의 GradientBoosting 하이퍼파라미터
best_gb_model = gb_grid_search.best_estimator_
print(f"GradientBoosting Best Params: {gb_grid_search.best_params_}")

# 모델 저장 (학습이 완료된 후 모델을 저장하는 코드 추가)
with open('gradient_boosting_model.pkl', 'wb') as gb_file:
    pickle.dump(best_gb_model, gb_file)


# 7. 각 모델의 MSE 및 Cross-Validation MSE 계산
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_train)
    mse = mean_squared_error(y_train, y_pred)
    print(f"{name} - MSE: {mse}")

# 8. 최적화된 RandomForest 및 GradientBoosting 모델을 앙상블하여 예측
def ensemble_predict(X):
    rf_preds = best_rf_model.predict(X)
    gb_preds = best_gb_model.predict(X)
    return (rf_preds + gb_preds) / 2  # 앙상블 예측 (평균)

# 9. 앙상블 교차 검증
def ensemble_cross_val(X, y, n_splits=5):
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    ensemble_cv_mse = []
    
    for train_index, val_index in kf.split(X):
        X_train_fold, X_val_fold = X[train_index], X[val_index]
        y_train_fold, y_val_fold = y[train_index], y[val_index]
        
        # 각 폴드에서 모델 학습
        best_rf_model.fit(X_train_fold, y_train_fold)
        best_gb_model.fit(X_train_fold, y_train_fold)
        
        # 앙상블 예측
        y_val_pred = ensemble_predict(X_val_fold)
        fold_mse = mean_squared_error(y_val_fold, y_val_pred)
        ensemble_cv_mse.append(fold_mse)
    
    return np.mean(ensemble_cv_mse)

# 앙상블 모델 교차 검증 MSE
ensemble_cv_mse = ensemble_cross_val(X_train, y_train, n_splits=5)
print(f"Ensemble Model - Cross-Validation MSE: {ensemble_cv_mse}")

# 10. 테스트 세트로 평가
test_set = pd.merge(test_set, users[['User_id', 'Age', 'Gender']], on='User_id', how='left')
test_set = pd.merge(test_set, products, on='Product_id', how='left')
test_set['Product_Vector'] = test_set['Product_id'].apply(get_product_vector)

X_test = np.hstack([
    np.stack(test_set['Product_Vector'].values),
    test_set[['Age', 'Gender', 'Price']].values,
    test_set[category_encoded_df.columns].values
])
y_test = test_set['Quantity'].values

# 앙상블 모델 예측
ensemble_pred = ensemble_predict(X_test)

# 앙상블 모델의 MSE 계산
ensemble_mse = mean_squared_error(y_test, ensemble_pred)
print(f"Ensemble Model - MSE: {ensemble_mse}")

#Quantity 값의 평균과 분산 확인
mean_quantity = y_train.mean()
variance_quantity = y_train.var()

print(f"Quantity의 평균: {mean_quantity}, 분산: {variance_quantity}")

# 잔차 계산
residuals = y_train - ensemble_predict(X_train)

# 잔차 히스토그램
plt.figure(figsize=(10,6))
sns.histplot(residuals, kde=True, color="green")
plt.title("Residuals Distribution")
plt.xlabel("Residuals")
plt.ylabel("Frequency")
plt.show()

# 잔차 플롯
plt.figure(figsize=(10,6))
plt.scatter(ensemble_predict(X_train), residuals, color="blue", alpha=0.5)
plt.axhline(0, color='red', linestyle='--')
plt.title("Residuals vs Predicted Values")
plt.xlabel("Predicted Quantity")
plt.ylabel("Residuals")
plt.show()

# Baseline 모델: 타겟 변수의 평균값으로 예측
baseline_pred = np.full_like(y_test, y_train.mean())
baseline_mse = mean_squared_error(y_test, baseline_pred)

print(f"Baseline Model MSE: {baseline_mse}")
print(f"Ensemble Model MSE: {ensemble_mse}")

# 10개의 제품을 추천하고 JSON 형식으로 출력하도록 수정
def recommend_for_user(user_id, top_n=10):  # top_n을 10개로 변경
    user_purchases = purchase_history[purchase_history['User_id'] == user_id]['Product_id'].tolist()
    all_products = products['Product_id'].tolist()
    products_to_score = [p for p in all_products if p not in user_purchases]
    
    # 제품들에 대한 예측 점수
    product_vectors = np.array([get_product_vector(p) for p in products_to_score])
    user_info = users[users['User_id'] == user_id][['Age', 'Gender']].values
    product_info = products[products['Product_id'].isin(products_to_score)][['Price']].values
    category_info = products[products['Product_id'].isin(products_to_score)][category_encoded_df.columns].values

    # 모든 제품에 대해 사용자의 정보와 결합하여 예측 수행
    X_recommend = np.hstack([
        product_vectors,
        np.repeat(user_info, len(products_to_score), axis=0),
        product_info,
        category_info
    ])
    
    scores = ensemble_predict(X_recommend)
    
    # 상위 N개의 추천 제품
    top_indices = np.argsort(scores)[-top_n:][::-1]
    top_products = [products_to_score[i] for i in top_indices]
    
    # 추천된 제품의 전체 정보(Product2 테이블) JSON 형식으로 반환
    recommended_products = products[products['Product_id'].isin(top_products)]
    return recommended_products.to_json(orient='records', force_ascii=False)

# 예시: User_id 1에 대한 추천 (10개의 제품을 JSON으로 출력)
user_id = 1
recommendations_json = recommend_for_user(user_id)
print(f"User {user_id}의 추천 상품 (JSON 형식): {recommendations_json}")