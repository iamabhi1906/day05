'use server';

import { db } from '@/lib/firebase';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Protect } from '@/lib/auth';

export const changeOrderStatus = async (orderId: string, status: string) => {
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  if (!status) {
    throw new Error('Order status is required');
  }

  await Protect();

  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};
