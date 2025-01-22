import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './IngredientsSlice';
import constructorItemsSlice from '../slices/constructorItemsSlice';
import orderSlice from './ordersSlice';
import ordersDataSlice from './ordersSlice';
import userOrdersSlice from './userOrderSlice';
import authSlice from './authSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorItemsSlice,
  ordersData: ordersDataSlice,
  order: orderSlice,
  userOrders: userOrdersSlice,
  auth: authSlice
});

export default rootReducer;
