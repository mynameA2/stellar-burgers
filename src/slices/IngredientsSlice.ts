import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';
import { getIngredientsApi } from '../utils/burger-api';

export interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}
// начальное состояние
const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};
// асинхронные экшены
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);
// редюсер
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // обработка при загрузке
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    // обработка при успешном получении данных
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.ingredients = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    // обработка при ошибке
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error';
    });
  }
});

export default ingredientsSlice.reducer;
