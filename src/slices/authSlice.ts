import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../utils/types';
import { updateUserApi, refreshToken } from '../utils/burger-api';

interface IAuthState {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
}

const initialState: IAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  error: null,
  isLoading: false
};

// обновления данных пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: { name: string; email: string; password: string }) => {
    const user = await updateUserApi(userData);
    return user;
  }
);

// обновления токенов
export const updateTokens = createAsyncThunk('auth/updateTokens', async () => {
  const response = await refreshToken(); // обновление токена через API
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    response;

  return response;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // установка данных пользователя
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    // установка токенов
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    // выход из профиля
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error';
    });
  }
});

export const { setUser, setTokens, logout, startLoading, stopLoading } =
  authSlice.actions;
export default authSlice.reducer;
