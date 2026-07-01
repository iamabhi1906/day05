import { CartData } from '@/features/cart/cart.types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { cartItemFromDoc } from './cart';

const cartCollection = collection(db, 'cartItems');

export const getCartItems = async (buyerEmail: string): Promise<CartData[]> => {
  const q = query(cartCollection, where('buyerEmail', '==', buyerEmail));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(cartItemFromDoc);
};

export const getProductCartItem = async (buyerEmail: string, productId: string): Promise<CartData | null> => {
  const q = query(cartCollection, where('buyerEmail', '==', buyerEmail), where('productId', '==', productId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  return cartItemFromDoc(snapshot.docs[0]);
};
