import { UserInfo } from 'firebase/auth';
import api from '@/lib/api/api';
import { serverApi } from '../api/server.api';
import { UserData } from '@/features/user/user.types';

export type { UserData } from '@/features/user/user.types';

export const createUser = async (_user: UserInfo, _role: string | null, _name?: string) => null;

export const getUserByEmail = async (_email?: string): Promise<UserData | null> => {
  try {
    const client = await serverApi();
    const { data } = await client.get('/auth/me');
    return data as UserData | null;
  } catch {
    return null;
  }
};

export const updateUserByEmail = async (
  _email: string,
  updatedFields: Partial<Omit<UserData, 'id' | 'createdAt' | 'email'>>,
): Promise<UserData | null> => {
  try {
    const { data } = await api.patch('/users/profile', updatedFields);
    return data as UserData;
  } catch {
    return null;
  }
};

export const getAllUsers = async (): Promise<UserData[]> => {
  const client = await serverApi();
  const { data } = await client.get('/admin/users');
  return data as UserData[];
};

export const deleteUserByEmail = async (_email: string): Promise<void> => undefined;
