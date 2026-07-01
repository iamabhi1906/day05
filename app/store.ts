import userCartReducer from '@/features/cart/cart.slice';
import userReducer from '@/features/user/user.slice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: userCartReducer,
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
