'use server';

import { CartData } from '@/features/cart/cart.types';
import { serverApi } from '@/lib/api/server.api';

export async function PlaceAnOrder(cartItems: CartData[], promoCode: string | null) {
  const api = await serverApi();
  const productIds = cartItems.map((item) => Number(item.productId));
  const { data } = await api.post('/orders', { productIds, promoCode: promoCode?.trim() || undefined });
  return data;
}
