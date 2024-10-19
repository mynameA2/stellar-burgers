import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../utils/types';
import {
  orderBurgerApi,
  getFeedsApi,
  getOrderByNumberApi
} from '../utils/burger-api';

// Начальное состояние для заказа
const initialState: TOrdersData & {
  order: TOrder | null;
  isLoadingSingleOrder: boolean;
} = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  isLoadingSingleOrder: false,
  order: null,
  errorText: null
};

// Thunk для отправки заказа на сервер
export const sendOrder = createAsyncThunk(
  'orders/sendOrder',
  async (orderIngredients: string[]) => {
    const response = await orderBurgerApi(orderIngredients);
    return response.order; // Вернуть данные о заказе, если запрос успешен
  }
);

// Thunk для получения всех заказов
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await getFeedsApi();
  return response;
});

// Thunk для получения заказа по ID
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string) => {
    const response = await getOrderByNumberApi(Number(orderId));
    return response.orders[0]; // Возвращаем один заказ
  }
);

// Объединённый слайс для заказов
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Очистить информацию о текущем заказе
    clearOrder(state) {
      state.order = null;
      state.errorText = null;
      state.isLoadingSingleOrder = false;
    }
  },
  extraReducers: (builder) => {
    // sendOrder
    builder
      .addCase(sendOrder.pending, (state) => {
        state.isLoadingSingleOrder = true;
        state.errorText = null;
      })
      .addCase(sendOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.isLoadingSingleOrder = false;
        state.order = action.payload;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.isLoadingSingleOrder = false;
        state.errorText = action.payload as string;
      });

    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.errorText = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchOrders.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.errorText = action.payload;
      });

    // fetchOrderById
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoadingSingleOrder = true;
        state.errorText = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoadingSingleOrder = false;

          // Проверяем, есть ли уже такой заказ в списке
          const existingOrderIndex = state.orders.findIndex(
            (order) => order._id === action.payload._id
          );

          // Если такой заказ уже есть, обновляем его
          // Если нет, добавляем новый
          if (existingOrderIndex !== -1) {
            state.orders[existingOrderIndex] = action.payload;
          } else {
            state.orders.push(action.payload);
          }
        }
      )
      .addCase(fetchOrderById.rejected, (state, action: PayloadAction<any>) => {
        state.isLoadingSingleOrder = false;
        state.errorText = action.payload;
      });
  },
  selectors: { selectLoading: (state) => state.isLoading }
});

export const selectLoading = ordersSlice.selectors.selectLoading;
// Экспорт действий и редюсера
export const { clearOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
