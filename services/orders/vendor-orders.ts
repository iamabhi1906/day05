'use server';

import { OrderData, OrderStatus } from '@/features/orders/orders.types';
import { orderFromApi } from '@/lib/api/commerce';
import { serverApi } from '@/lib/api/server.api';

export const getVendorOrders = async (): Promise<OrderData[]> => {
  const api = await serverApi();
  const { data } = await api.get('/orders/vendor');
  return (data as Record<string, unknown>[]).map(orderFromApi);
};

export const changeOrderStatus = async (orderId: string | number, status: OrderStatus): Promise<OrderData> => {
  const api = await serverApi();
  const { data } = await api.patch(`/orders/${orderId}/status`, { status });
  return orderFromApi(data as Record<string, unknown>);
};
