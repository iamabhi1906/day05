'use server';
import { getDocs, query, where } from 'firebase/firestore';
import { reviewCollection, ReviewFromDoc } from './collection';
import { Protect } from '@/lib/auth';
import { Review } from '@/features/review/review.types';

export async function getProductReview(productId: string, orderId: string): Promise<Review | null> {
  try {
    await Protect();
    const options = query(reviewCollection, where('productId', '==', productId), where('orderId', '==', orderId));
    const snapshot = await getDocs(options);
    if (snapshot.empty) {
      return null;
    }
    return ReviewFromDoc(snapshot.docs[0]);
  } catch (error) {
    console.log('Error loading the page:- ', error);
    throw new Error('Error fetching the product reviews');
  }
}

export async function getAllProductReviews(productId: string): Promise<Review[]> {
  try {
    const options = query(reviewCollection, where('productId', '==', productId));
    const snapshot = await getDocs(options);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(ReviewFromDoc);
  } catch (error) {
    console.log('Error loading the page:- ', error);
    throw new Error('Error fetching the product reviews');
  }
}
