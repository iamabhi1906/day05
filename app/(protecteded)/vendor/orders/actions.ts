'use server';

import { revalidatePath } from 'next/cache';
import { changeOrderStatus } from '@/services/orders/vendor-orders';
import { OrderStatus } from '@/features/orders/orders.types';

export async function updateVendorOrderStatus(formData: FormData) {
  const orderId = formData.get('orderId')?.toString();
  const status = formData.get('status')?.toString();
  if (!orderId || !status) {
    throw new Error('Missing order data');
  }
  const validStatus = Object.values(OrderStatus).find((value) => value === status);
  if (!validStatus) {
    throw new Error('Invalid order status');
  }
  await changeOrderStatus(orderId, validStatus as OrderStatus);
  revalidatePath('/vendor/orders');
}
