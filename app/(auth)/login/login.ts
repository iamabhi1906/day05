// 'use server';
import { UserData, UserSchema } from '@/features/user/user.types';
import axios from 'axios';
import { ApiError } from 'next/dist/server/api-utils';
import api from '@/lib/api/api';

export const EmailLogin = async (email: string, password: string): Promise<UserData | null> => {
  try {
    const result = await api.post('/auth/login', { email, password });
    return UserSchema.parse(result.data.user);
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiError>(error)) {
      throw new Error(error.response?.data?.message ?? 'Signup failed');
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Signup failed');
  }
};
