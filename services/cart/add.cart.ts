import api from '@/lib/api/api';
import { ProductData } from '@/features/product/product.types';

export const addProductToCart = async (_buyerEmail: string, product: ProductData) => {
  await api.post('/cart', { productId: Number(product.id), quantity: 1 });
};

export const cartQuantityChange = async (cartId: string, quantity: number) => {
  if (quantity <= 0) await api.delete(`/cart/${cartId}`);
  else await api.patch(`/cart/${cartId}`, { quantity });
};
