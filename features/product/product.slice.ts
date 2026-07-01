import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductData, ProductState } from './product.types';

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

const handlePending = (state: ProductState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: ProductState, action: { payload?: string }) => {
  state.loading = false;
  state.error = action.payload ?? 'Something went wrong';
};

const productSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductData[]>) => {
      state.products = action.payload;
      state.error = null;
    },
    clearProducts: (state) => {
      state.products = [];
      state.error = null;
    },
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, clearProducts, setProductsLoading } = productSlice.actions;

const productsReducer = productSlice.reducer;
export default productsReducer;
