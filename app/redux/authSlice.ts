//
// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  isLoadingRecommendations: boolean,
  recommendations: Product[];
}

const initialState: AuthState = {
  isLoggedIn: false,
  userId: null,
  isLoadingRecommendations: false,
  recommendations: [],
}; 

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.userId = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userId = null;
      state.recommendations = [];
    },
    setRecommendations(state, action: PayloadAction<Product[]>) {
      state.isLoadingRecommendations = false;
      state.recommendations = action.payload;
    },
    startLoadingRecommendations(state) { // 로딩 시작 액션 추가
      state.isLoadingRecommendations = true;
    },
  },
});

export const { login, logout, setRecommendations ,startLoadingRecommendations } = authSlice.actions;

export default authSlice.reducer;
