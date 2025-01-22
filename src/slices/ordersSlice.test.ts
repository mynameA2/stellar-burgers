import { createSlice } from '@reduxjs/toolkit';
import ordersReducer, {
  initialState,
  sendOrder,
  fetchOrders,
  fetchOrderById,
  clearOrder
} from './ordersSlice';
import { TOrder } from '../utils/types';

// Пример тестового заказа
const order1: TOrder = {
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093c'
  ],
  _id: 'order1',
  status: 'done',
  name: 'Жуткий био-марсианский бургер',
  createdAt: '2024-10-30T18:33:05.208Z',
  updatedAt: '2024-10-30T18:33:06.191Z',
  number: 1
};

// Начальное состояние для тестирования
export const ordersInitialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  isLoadingSingleOrder: false,
  order: null,
  errorText: null
};

describe('ordersSlice reducer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(
      ordersInitialState
    );
  });

  describe('sendOrder', () => {
    it('should handle pending state', () => {
      const state = ordersInitialState;
      expect(
        ordersReducer(state, {
          type: sendOrder.pending.type
        })
      ).toEqual({
        ...state,
        isLoadingSingleOrder: true,
        errorText: null
      });
    });

    it('should handle fulfilled state', () => {
      const newOrder: TOrder = {
        ingredients: ['643d69a5c3f7b9001cfa093c'],
        _id: 'newOrderId',
        status: 'done',
        name: 'Новый заказ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: 1
      };

      const initialStateWithOrders = {
        ...ordersInitialState,
        orders: [] // Начальное состояние с пустым массивом
      };

      expect(
        ordersReducer(initialStateWithOrders, {
          type: sendOrder.fulfilled.type,
          payload: newOrder // Передаем новый заказ
        })
      ).toEqual({
        ...initialStateWithOrders,
        isLoadingSingleOrder: false,
        orders: [newOrder], // Новый заказ добавляется в массив
        order: newOrder // Устанавливаем текущий заказ
      });
    });

    it('should handle rejected state', () => {
      const state = {
        ...ordersInitialState,
        isLoadingSingleOrder: true
      };
      const errorMessage = 'Ошибка при отправке заказа';
      expect(
        ordersReducer(state, {
          type: sendOrder.rejected.type,
          error: { message: errorMessage }
        })
      ).toEqual({
        ...state,
        isLoadingSingleOrder: false,
        errorText: errorMessage
      });
    });
  });

  describe('fetchOrders', () => {
    it('should handle pending state', () => {
      const state = ordersInitialState;
      expect(
        ordersReducer(state, {
          type: fetchOrders.pending.type
        })
      ).toEqual({
        ...state,
        isLoading: true,
        errorText: null
      });
    });

    it('should handle fulfilled state', () => {
      const state = {
        ...ordersInitialState,
        orders: [], // Начальное состояние с пустым массивом заказов
        isLoadingSingleOrder: true
      };

      // Проверяем, что заказ добавляется один раз, а не дважды
      expect(
        ordersReducer(state, {
          type: fetchOrderById.fulfilled.type,
          payload: order1 // Заказ, который мы получаем
        })
      ).toEqual({
        ...state,
        isLoadingSingleOrder: false,
        orders: [order1], // Мы добавляем один заказ в массив
        order: order1
      });
    });

    it('should handle rejected state', () => {
      const state = {
        ...ordersInitialState,
        isLoading: true
      };
      const errorMessage = 'Ошибка при загрузке заказов';
      expect(
        ordersReducer(state, {
          type: fetchOrders.rejected.type,
          error: { message: errorMessage }
        })
      ).toEqual({
        ...state,
        isLoading: false,
        errorText: errorMessage
      });
    });
  });

  describe('fetchOrderById', () => {
    it('should handle pending state', () => {
      const state = ordersInitialState;
      expect(
        ordersReducer(state, {
          type: fetchOrderById.pending.type
        })
      ).toEqual({
        ...state,
        isLoadingSingleOrder: true,
        errorText: null
      });
    });

    it('should handle fulfilled state', () => {
      const state = {
        ...ordersInitialState,
        orders: [],
        isLoadingSingleOrder: true
      };

      expect(
        ordersReducer(state, {
          type: fetchOrderById.fulfilled.type,
          payload: order1 // Заказ, который мы получаем
        })
      ).toEqual({
        ...state,
        isLoadingSingleOrder: false,
        orders: [order1], // Добавляем новый заказ в список
        order: order1
      });
    });

    it('should handle rejected state', () => {
      const state = {
        ...ordersInitialState,
        isLoadingSingleOrder: true
      };
      const errorMessage = 'Ошибка при загрузке заказа';
      expect(
        ordersReducer(state, {
          type: fetchOrderById.rejected.type,
          error: { message: errorMessage }
        })
      ).toEqual({
        ...state,
        isLoadingSingleOrder: false,
        errorText: errorMessage
      });
    });
  });

  it('should handle clearOrder', () => {
    const state = {
      ...ordersInitialState,
      order: order1,
      errorText: 'error'
    };
    expect(ordersReducer(state, clearOrder())).toEqual({
      ...state,
      order: null,
      errorText: null,
      isLoadingSingleOrder: false
    });
  });
});
