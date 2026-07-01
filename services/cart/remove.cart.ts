import { db } from '@/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { getCartItems } from './get.cart';

export const removeUserCartItem = async (cartItemId: string) => {
  await deleteDoc(doc(db, 'cartItems', cartItemId));
};

export const clearUserCartItems = async (buyerEmail: string) => {
  const items = await getCartItems(buyerEmail);
  await Promise.all(items.map((item) => deleteDoc(doc(db, 'cartItems', item.id))));
};
