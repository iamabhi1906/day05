import { VendorProtect } from '@/lib/auth';
import { getDocs, orderBy, query, where, writeBatch } from 'firebase/firestore';
import { ordersCollection } from './collections';
import { orderFromDoc } from './shared';
import { OrderData, OrderStatus } from '@/features/orders/orders.types';
import { db } from '@/lib/firebase';

export const getVendorOrders = async (): Promise<OrderData[]> => {
  const user = await VendorProtect();
  const q = query(ordersCollection, where('vendorEmail', '==', user.email), orderBy('placedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(orderFromDoc);
};

export const changeOrderStatus = async (orderId: string | number, status: OrderStatus): Promise<OrderData[]> => {
  const user = await VendorProtect();
  const numericOrderId = Number(orderId);

  if (!Number.isFinite(numericOrderId)) {
    throw new Error('Invalid order ID');
  }

  const q = query(ordersCollection, where('orderId', '==', numericOrderId), where('vendorEmail', '==', user.email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Order not found');
  }

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnapshot) => {
    batch.update(docSnapshot.ref, {
      status,
      updatedAt: new Date(),
    });
  });

  await batch.commit();
  return snapshot.docs.map(orderFromDoc);
};
