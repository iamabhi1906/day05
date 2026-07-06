import { OrderData, ordersSchema } from '@/features/orders/orders.types';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  return typeof value?.toDate === 'function' ? value.toDate() : null;
};

export const orderFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): OrderData => {
  const data = snapshot.data();
  return ordersSchema.parse(data);
};
