import api from '@/lib/api/api';
import { addressFromApi } from '@/lib/api/commerce';

export interface UserAddress {
  id: string;
  email: string;
  city: string;
  landmark: string;
  state: string;
  pinCode: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsed: Date | null;
}

type AddressInput = Omit<UserAddress, 'id' | 'email' | 'createdAt' | 'updatedAt' | 'lastUsed'>;

export const getUserAddresses = async (_email?: string): Promise<UserAddress[]> => {
  const { data } = await api.get('/addresses');
  return (data as Record<string, unknown>[]).map(addressFromApi);
};

export const createUserAddress = async (_email: string, address: AddressInput) => {
  const { data } = await api.post('/addresses', address);
  return addressFromApi(data as Record<string, unknown>);
};

export const updateUserAddress = async (_email: string, addressId: string, address: Partial<AddressInput>) => {
  const { data } = await api.patch(`/addresses/${addressId}`, address);
  return addressFromApi(data as Record<string, unknown>);
};

export const setDefaultAddress = async (_email: string, addressId: string) => { await api.patch(`/addresses/${addressId}/default`); };

export const deleteUserAddress = async (_email: string, addressId: string) => { await api.delete(`/addresses/${addressId}`); };
