import { CartData } from '@/features/cart/cart.types';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  const d = typeof value?.toDate === 'function' ? value.toDate() : null;
  return d ? d.toISOString() : null;
};

export const cartItemFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): CartData => {
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
