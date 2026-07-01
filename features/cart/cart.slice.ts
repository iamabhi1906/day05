import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartData, CartState } from './cart.types';
import { getUserCartItemsAsync, addUserCartItemAsync, removeUserCartItemAsync, clearUserCartAsync, updateUserCartItemQuantityAsync } from './cart.actions';

const calculateTotal = (items: CartData[]) => items.reduce((total, item) => total + item.price * item.quantity, 0);

const initialState: CartState = {
  cartItem: [],
  loading: false,
  error: null,
  total: 0,
};

const updateCart = (state: CartState, action: PayloadAction<CartData[]>) => {
  state.loading = false;
  state.error = null;
  state.cartItem = action.payload;
  state.total = calculateTotal(action.payload);
};

const handlePending = (state: CartState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: CartState, action: { payload?: string }) => {
  state.loading = false;
  state.error = action.payload ?? 'Something went wrong';
};

const userCartSlice = createSlice({
  name: 'product-cart',
  initialState,
  reducers: {
    resetCartState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUserCartItemsAsync.pending, handlePending)
      .addCase(getUserCartItemsAsync.fulfilled, updateCart)
      .addCase(getUserCartItemsAsync.rejected, handleRejected)

      .addCase(addUserCartItemAsync.pending, handlePending)
      .addCase(addUserCartItemAsync.fulfilled, updateCart)
      .addCase(addUserCartItemAsync.rejected, handleRejected)

      .addCase(removeUserCartItemAsync.pending, handlePending)
      .addCase(removeUserCartItemAsync.fulfilled, updateCart)
      .addCase(removeUserCartItemAsync.rejected, handleRejected)

      .addCase(updateUserCartItemQuantityAsync.pending, handlePending)
      .addCase(updateUserCartItemQuantityAsync.fulfilled, updateCart)
      .addCase(updateUserCartItemQuantityAsync.rejected, handleRejected)

      .addCase(clearUserCartAsync.pending, handlePending)
      .addCase(clearUserCartAsync.fulfilled, updateCart)
      .addCase(clearUserCartAsync.rejected, handleRejected);
  },
});

export const { resetCartState } = userCartSlice.actions;

const userCartReducer = userCartSlice.reducer;

export default userCartReducer;
