import { ProductData } from '@/features/product/product.types';
import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';

const cartCollection = collection(db, 'cartItems');

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
    productImageUrls: product.imageUrls,
    vendorEmail: product.vendorEmail,
    price: product.price,
    quantity: 1,
    addedAt: serverTimestamp(),
  });
};

export const cartQuantityChange = async (cartId: string, quantity: number) => {
  if (quantity <= 0) {
    await deleteDoc(doc(db, 'cartItems', cartId));
    return;
  }
  await updateDoc(doc(db, 'cartItems', cartId), { quantity });
};
