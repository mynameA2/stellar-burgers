import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import rootReducer from '../slices/rootReducer'; // Импортируем редьюсер

// Создаем хранилище (store) с редьюсером stellarBurger
const store = configureStore({
  reducer: rootReducer, // Добавляем редьюсер в хранилище
  devTools: process.env.NODE_ENV !== 'production' // Включаем Redux DevTools в режиме разработки
});

// Типизация состояния и диспатча для использования в приложении
export type RootState = ReturnType<typeof store.getState>; // Получаем тип состояния всего хранилища
export type AppDispatch = typeof store.dispatch; // Получаем тип dispatch

// Кастомные хуки для dispatch и selector с правильной типизацией
export const useDispatch: () => AppDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
