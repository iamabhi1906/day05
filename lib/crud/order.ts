import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { CartItemData, clearCart } from './cart';

export interface OrderItemData {
  productId: string;
  productName: string;
  productImageUrl: string;
  vendorEmail: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  id: string;
  buyerEmail: string;
  items: OrderItemData[];
  total: number;
  status: 'placed';
  createdAt: Date | null;
}

const ordersCollection = collection(db, 'orders');

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  return typeof value?.toDate === 'function' ? value.toDate() : null;
};

const orderFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): OrderData => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    buyerEmail: data.buyerEmail,
    items: data.items || [],
    total: Number(data.total || 0),
    status: data.status,
    createdAt: toDate(data.createdAt),
  };
};

export const placeOrder = async (buyerEmail: string, cartItems: CartItemData[]) => {
  if (cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  const items: OrderItemData[] = cartItems.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    productImageUrl: item.productImageUrl,
    vendorEmail: item.vendorEmail,
    price: item.price,
    quantity: item.quantity,
  }));

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await addDoc(ordersCollection, {
    buyerEmail,
    items,
    total,
    status: 'placed',
    createdAt: serverTimestamp(),
  });

  await clearCart(buyerEmail);
};

export const getBuyerOrders = async (buyerEmail: string): Promise<OrderData[]> => {
  const q = query(ordersCollection, where('buyerEmail', '==', buyerEmail), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(orderFromDoc);
};
