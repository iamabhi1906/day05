import api from '@/lib/api/api';
import { ProductData } from '@/features/product/product.types';
import { ApiProduct } from '@/lib/crud/product';

export const addProductToCart = async (_buyerEmail: string, product: ApiProduct) => {
  await api.post('/cart', { productId: Number(product.id), quantity: 1 });
};

export const cartQuantityChange = async (cartId: string, quantity: number) => {
  if (quantity <= 0) await api.delete(`/cart/${cartId}`);
  else await api.patch(`/cart/${cartId}`, { quantity });
};
