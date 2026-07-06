import { OrderData } from '@/features/orders/orders.types';
import { Protect } from '@/lib/auth';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import { ordersCollection } from './collections';
import { orderFromDoc } from './shared';

export const getBuyerOrders = async (): Promise<OrderData[]> => {
  const user = await Protect();
  const q = query(ordersCollection, where('buyerEmail', '==', user.email), orderBy('placedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(orderFromDoc);
};
