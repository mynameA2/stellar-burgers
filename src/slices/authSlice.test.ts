import authReducer, {
  setUser,
  setTokens,
  logout,
  startLoading,
  stopLoading,
  updateUser
} from './authSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

jest.mock('../utils/burger-api', () => ({
  updateUserApi: jest.fn()
}));

// Определение мокового асинхронного экшена updateUser для тестов
const mockUpdateUser = createAsyncThunk('auth/updateUser', async () => ({
  user: { name: 'MockUser', email: 'mock@example.com' }
}));

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  error: null,
  isLoading: false
};

describe('auth reducer', () => {
  it('должен изменить isLoading на true при старте запроса', () => {
    const action = { type: mockUpdateUser.pending.type };
    const state = authReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('должен сохранить пользователя и изменить isLoading на false при успешном запросе', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    const action = { type: mockUpdateUser.fulfilled.type, payload: { user } };
    const state = authReducer(initialState, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('должен сохранить ошибку и изменить isLoading на false при неудачном запросе', () => {
    const error = 'Error';
    const action = {
      type: mockUpdateUser.rejected.type,
      error: { message: error }
    };
    const state = authReducer(initialState, action);
    expect(state.error).toBe(error);
    expect(state.isLoading).toBe(false);
  });
});

describe('auth actions', () => {
  it('должен установить данные пользователя при setUser', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    const state = authReducer(initialState, setUser(user));
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('должен установить токены при setTokens', () => {
    const tokens = { accessToken: 'access', refreshToken: 'refresh' };
    const state = authReducer(initialState, setTokens(tokens));
    expect(state.accessToken).toBe('access');
    expect(state.refreshToken).toBe('refresh');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('должен очистить состояние при logout', () => {
    const modifiedState = {
      ...initialState,
      user: { name: 'Test', email: 'test@example.com' },
      accessToken: 'access',
      refreshToken: 'refresh',
      isAuthenticated: true
    };
    const state = authReducer(modifiedState, logout());
    expect(state).toEqual(initialState);
  });

  it('должен установить isLoading в true при startLoading', () => {
    const state = authReducer(initialState, startLoading());
    expect(state.isLoading).toBe(true);
  });

  it('должен установить isLoading в false при stopLoading', () => {
    const modifiedState = { ...initialState, isLoading: true };
    const state = authReducer(modifiedState, stopLoading());
    expect(state.isLoading).toBe(false);
  });
});

export const authInitialState = initialState;
