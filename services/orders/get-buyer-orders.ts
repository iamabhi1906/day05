import { OrderData, ordersSchema } from '@/features/orders/orders.types';
import { Protect } from '@/lib/auth';
import { DocumentData, getDocs, orderBy, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { ordersCollection } from './collections';

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  return typeof value?.toDate === 'function' ? value.toDate() : null;
};

const orderFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): OrderData => {
  const data = snapshot.data();
  return ordersSchema.parse(data);
};

export const getBuyerOrders = async (): Promise<OrderData[]> => {
  const user = await Protect();
  const q = query(ordersCollection, where('buyerEmail', '==', user.email), orderBy('placedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(orderFromDoc);
};
