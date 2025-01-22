import userOrdersSlice, {
  IUserOrdersState,
  fetchUserOrders
} from './userOrderSlice';
import { TOrder } from '@utils-types';

// Начальное состояние для тестов
const initialState: IUserOrdersState = {
  orders: [],
  isLoading: true,
  error: null,
};

// Пример тестового заказа
const order1: TOrder = {
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093c',
  ],
  _id: 'order1',
  status: 'done',
  name: 'Жуткий био-марсианский бургер',
  createdAt: '2024-10-30T18:33:05.208Z',
  updatedAt: '2024-10-30T18:33:06.191Z',
  number: 1,
};

const populatedState: IUserOrdersState = {
  orders: [order1],
  isLoading: false,
  error: null,
};

const reducer = userOrdersSlice;

describe('userOrdersSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchUserOrders', () => {
    it('should handle pending state', () => {
      const action = { type: fetchUserOrders.pending.type };
      const expectedState = {
        ...initialState,
        isLoading: true,
        error: null,
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: [order1], // Массив заказов
      };
      const expectedState = {
        ...initialState,
        isLoading: false,
        orders: [order1], // Обновляем заказы
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle rejected state', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: 'Ошибка загрузки заказов', // Ошибка
      };
      const expectedState = {
        ...initialState,
        isLoading: false,
        error: 'Ошибка загрузки заказов', // Устанавливаем текст ошибки
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });
});

export const userOrdersInitialState = initialState;
