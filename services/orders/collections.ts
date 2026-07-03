import { db } from '@/lib/firebase';
import { collection } from 'firebase/firestore';

export const ordersCollection = collection(db, 'orders');


