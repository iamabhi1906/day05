import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData, UserState } from './user.types';
import { getUserAsync, updateUserAsync } from './user.actions';

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const handlePending = (state: UserState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: UserState, action: { payload?: string }) => {
  state.loading = false;
  state.error = action.payload ?? 'Something went wrong';
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAsync.pending, handlePending)
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserAsync.rejected, handleRejected)

      .addCase(updateUserAsync.pending, handlePending)
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userData = action.payload;
      })
      .addCase(updateUserAsync.rejected, handleRejected);
  },
});

export const { setUserData, clearUserData, setUserLoading } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
