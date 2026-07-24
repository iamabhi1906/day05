import { OrderData } from '@/features/orders/orders.types';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import { ordersCollection } from './collections';
import { orderFromDoc } from './shared';
import { UserData } from '@/features/user/user.types';

export const getBuyerOrders = async (user: UserData): Promise<OrderData[]> => {
  const q = query(ordersCollection, where('buyerEmail', '==', user.email), orderBy('placedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(orderFromDoc);
};
