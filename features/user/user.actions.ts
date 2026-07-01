import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserByEmail, updateUserByEmail } from '@/lib/crud/user';
import { UserData } from './user.types';

interface GetUserPayload {
  email: string;
}

interface UpdateUserPayload {
  email: string;
  updatedFields: Partial<Omit<UserData, 'id' | 'createdAt' | 'email'>>;
}

export const getUserAsync = createAsyncThunk<UserData, GetUserPayload, { rejectValue: string }>(
  'user/get',
  async ({ email }, { rejectWithValue }) => {
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return rejectWithValue('User not found');
      }
      return user;
    } catch {
      return rejectWithValue('Failed to fetch user data');
    }
  },
);

export const updateUserAsync = createAsyncThunk<UserData, UpdateUserPayload, { rejectValue: string }>(
  'user/update',
  async ({ email, updatedFields }, { rejectWithValue }) => {
    try {
      const updatedUser = await updateUserByEmail(email, updatedFields);
      if (!updatedUser) {
        return rejectWithValue('Failed to update user');
      }
      return updatedUser;
    } catch {
      return rejectWithValue('Failed to update user data');
    }
  },
);
