//
// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  recommendations: Product[];
}

const initialState: AuthState = {
  isLoggedIn: false,
  userId: null,
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
      state.recommendations = action.payload;
    }
  },
});

export const { login, logout, setRecommendations } = authSlice.actions;

export default authSlice.reducer;
