import rootReducer from './rootReducer'; // путь к файлу с rootReducer
import { ingredientsSliceInitialState } from './IngredientsSlice.test';
import { constructorItemsInitialState } from './constructorItemsSlice.test';
import { ordersInitialState } from './ordersSlice.test';
import { userOrdersInitialState } from './userOrderSlice.test';
import { authInitialState } from './authSlice.test';

const initialState = {
  ingredients: ingredientsSliceInitialState,
  constructorItems: constructorItemsInitialState,
  order: ordersInitialState,
  ordersData: ordersInitialState,
  userOrders: userOrdersInitialState,
  auth: authInitialState
};

describe('rootReducer', () => {
  it('Initialization: should return the initial state', () => {
    expect(rootReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Unnamed action: should return the current state', () => {
    expect(rootReducer(initialState, { type: 'unknown' })).toEqual(
      initialState
    );
  });
});
