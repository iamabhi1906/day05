import api from '@/lib/api/api';
import axios from 'axios';
import { ApiError } from 'next/dist/server/api-utils';

export async function EmailSignup(name: string, email: string, password: string, role: string) {
  try {
    if (!name.trim() || !email || !password) {
      throw new Error('Please fill in all fields!');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters!');
    }
    if (!role) {
      throw new Error('Please provide a valid role!');
    }
    const result = await api.post('/auth/signup', { name, email, password, role });
  } catch (error: unknown) {
    console.log(error);
    if (axios.isAxiosError<ApiError>(error)) {
      throw new Error(error.response?.data?.message ?? 'Signup failed');
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Signup failed');
  }
}
