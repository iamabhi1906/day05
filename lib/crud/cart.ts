import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  doc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ProductData } from '@/features/product/product.types';

export interface CartItemData {
  id: string;
  buyerEmail: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  vendorEmail: string;
  price: number;
  quantity: number;
  addedAt: string | null;
}

const cartCollection = collection(db, 'cartItems');

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  const d = typeof value?.toDate === 'function' ? value.toDate() : null;
  return d ? d.toISOString() : null;
};

const cartItemFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): CartItemData => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    buyerEmail: data.buyerEmail,
    productId: data.productId,
    productName: data.productName,
    productImageUrl: data.productImageUrl,
    vendorEmail: data.vendorEmail,
    price: Number(data.price || 0),
    quantity: Number(data.quantity || 0),
    addedAt: toDate(data.addedAt),
  };
};

export const getCartItems = async (buyerEmail: string): Promise<CartItemData[]> => {
  const q = query(cartCollection, where('buyerEmail', '==', buyerEmail));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(cartItemFromDoc);
};

export const addProductToCart = async (buyerEmail: string, product: ProductData) => {
  const q = query(cartCollection, where('buyerEmail', '==', buyerEmail), where('productId', '==', product.id));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const cartItem = snapshot.docs[0];
    const quantity = Number(cartItem.data().quantity || 0) + 1;
    await updateDoc(doc(db, 'cartItems', cartItem.id), { quantity });
    return;
  }

  await addDoc(cartCollection, {
    buyerEmail,
    productId: product.id,
    productName: product.name,
    productImageUrl: product.imageUrl,
    vendorEmail: product.vendorEmail,
    price: product.price,
    quantity: 1,
    addedAt: serverTimestamp(),
  });
};

export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  await updateDoc(doc(db, 'cartItems', cartItemId), { quantity });
};

export const removeCartItem = async (cartItemId: string) => {
  await deleteDoc(doc(db, 'cartItems', cartItemId));
};

export const clearCart = async (buyerEmail: string) => {
  const items = await getCartItems(buyerEmail);
  await Promise.all(items.map((item) => deleteDoc(doc(db, 'cartItems', item.id))));
};
