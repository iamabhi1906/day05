'use server';

import { orderFromApi } from '@/lib/api/commerce';
import { serverApi } from '@/lib/api/server.api';
import { OrderData } from '@/features/orders/orders.types';

export const getBuyerOrders = async (): Promise<OrderData[]> => {
  const api = await serverApi();
  const { data } = await api.get('/orders/mine');
  return (data as Record<string, unknown>[]).map(orderFromApi);
};
