import constructorItemsSlice, {
  IConstructorItemsState,
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  setOrderRequest,
  setOrderModalData,
  setPrice,
  clearConstructor
} from './constructorItemsSlice';
import { TIngredient, TOrder } from '../utils/types';

const reducer = constructorItemsSlice; // Используем напрямую редьюсер

// Начальное состояние для тестов
const initialState: IConstructorItemsState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  price: 0
};

// Пример тестового ингредиента и заказа
const testBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const testIngredient1 = {
  _id: '643d69a5c3f7b9001cfa0941',
  id: '1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const testIngredient2 = {
  _id: '643d69a5c3f7b9001cfa0942',
  id: '2',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

const stateWithIngredients: IConstructorItemsState = {
  bun: testBun,
  ingredients: [testIngredient1, testIngredient2],
  orderRequest: false,
  orderModalData: null,
  price: 0
};

describe('constructorItemsSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should not change state on unknown action', () => {
      const action = { type: 'unknown' };
      const actual = reducer(stateWithIngredients, action);
      expect(actual).toEqual(stateWithIngredients);
    });
  });

  describe('reducers', () => {
    it('should handle addIngredient', () => {
      const actual = reducer(initialState, addIngredient(testIngredient1));
      expect(actual.ingredients.length).toBe(1);
      expect(actual.ingredients[0]._id).toBe(testIngredient1._id);
      expect(actual.ingredients[0].id).toBeDefined();
    });

    it('should replace bun with addIngredient if ingredient is a bun', () => {
      const actual = reducer(initialState, addIngredient(testBun));
      expect(actual.bun).toMatchObject({
        _id: testBun._id,
        name: testBun.name,
        type: testBun.type,
        proteins: testBun.proteins,
        fat: testBun.fat,
        carbohydrates: testBun.carbohydrates,
        calories: testBun.calories,
        price: testBun.price,
        image: testBun.image,
        image_mobile: testBun.image_mobile,
        image_large: testBun.image_large
      });
    });

    it('should not add more than 6 ingredients', () => {
      const stateWithMaxIngredients = {
        ...initialState,
        ingredients: Array(6).fill(testIngredient1)
      };
      const actual = reducer(
        stateWithMaxIngredients,
        addIngredient(testIngredient2)
      );
      expect(actual.ingredients.length).toBe(6); // Должно остаться 6
    });

    it('should handle removeIngredient', () => {
      const actual = reducer(
        stateWithIngredients,
        removeIngredient(testIngredient1.id)
      );
      expect(actual.ingredients.length).toBe(1);
      expect(actual.ingredients[0]._id).toBe(testIngredient2._id);
    });

    it('should handle moveIngredientDown', () => {
      const actual = reducer(
        stateWithIngredients,
        moveIngredientDown(testIngredient1._id) // Передаем _id
      );
      expect(actual.ingredients[0]._id).toBe(testIngredient2._id); // testIngredient2 на первой позиции
      expect(actual.ingredients[1]._id).toBe(testIngredient1._id); // testIngredient1 на второй позиции
    });

    it('should handle moveIngredientUp', () => {
      const actual = reducer(
        stateWithIngredients,
        moveIngredientUp(testIngredient2._id) // Передаем _id
      );
      expect(actual.ingredients[0]._id).toBe(testIngredient2._id); // testIngredient2 на первой позиции
      expect(actual.ingredients[1]._id).toBe(testIngredient1._id); // testIngredient1 на второй позиции
    });

    it('should handle setOrderRequest', () => {
      const actual = reducer(initialState, setOrderRequest(true));
      expect(actual.orderRequest).toBe(true);
    });

    it('should handle setOrderModalData', () => {
      const testOrder: TOrder = {
        _id: 'order1',
        ingredients: [testIngredient1._id],
        status: 'done',
        name: 'Тестовый заказ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: 1
      };
      const actual = reducer(initialState, setOrderModalData(testOrder));
      expect(actual.orderModalData).toEqual(testOrder);
    });

    it('should handle setPrice', () => {
      const actual = reducer(initialState, setPrice(1250));
      expect(actual.price).toBe(1250);
    });

    it('should handle clearConstructor', () => {
      const actual = reducer(stateWithIngredients, clearConstructor());
      expect(actual.bun).toBeNull();
      expect(actual.ingredients.length).toBe(0);
    });
  });
});

export const constructorItemsInitialState = initialState;
