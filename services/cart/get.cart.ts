import api from '@/lib/api/api';
import { cartFromApi } from '@/lib/api/commerce';
import { CartData } from '@/features/cart/cart.types';

export const getCartItems = async (_buyerEmail?: string): Promise<CartData[]> => {
  const { data } = await api.get('/cart');
  return (data as Record<string, unknown>[]).map(cartFromApi);
};

export const getProductCartItem = async (_buyerEmail: string, productId: string): Promise<CartData | null> => {
  const items = await getCartItems();
  return items.find((item) => item.productId === productId) ?? null;
};
