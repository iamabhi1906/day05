import { Review } from '@/features/review/review.types';
import { db } from '@/lib/firebase';
import { collection, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export const reviewCollection = collection(db, 'reviews');

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  const d = typeof value?.toDate === 'function' ? value.toDate() : null;
  return d ? d.toISOString() : null;
};

export const ReviewFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): Review => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    buyerEmail: data.buyerEmail,
    reviewerName: data.reviewerName,
    productId: data.productId,
    orderId: data.orderId,
    rating: data.rating,
    comment: data.comment,
    media: data.media,
    helpfulCount: Number(data.helpfulCount || 0),
    createdAt: toDate(data.createdAt) || new Date().toISOString(),
  };
};
