import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorItems, TIngredient, TOrder } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

interface IConstructorItemsState {
  bun: TIngredient | null;
  ingredients: (TIngredient & { uuid: string })[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  price: number;
}

// начальное состояние
const initialState: IConstructorItemsState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  price: 0
};

const constructorItemsSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    // редюсер для добавления ингредиента в конструктор
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload; // булка заменяется
      } else if (state.ingredients.length < 6) {
        state.ingredients.push({ ...action.payload, uuid: uuidv4() }); // добавляем уникальный ID
      }
    },
    // редюсер для удаления ингредиента из конструктора
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients = state.ingredients.filter(
        (item) => Number(item.uuid) === action.payload
      );
    },
    // редюсер для перемещения ингредиента вниз
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = state.ingredients.findIndex(
        (item) => Number(item.uuid) === action.payload
      );
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    // редюсер для перемещения ингредиента вверх
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = state.ingredients.findIndex(
        (item) => Number(item.uuid) === action.payload
      );
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    // редюсер для установки состояния загрузки заказа
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    // редюсер для установки информации о заказе
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
    // редюсер для установки цены
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
    // редюсер для очистки конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients
  }
});

export const { selectIngredients } = constructorItemsSlice.selectors;

export const {
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setOrderModalData,
  setPrice,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp
} = constructorItemsSlice.actions;
export default constructorItemsSlice.reducer;
