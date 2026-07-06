'use server';
import { Review, ReviewForm, ReviewFormOutput, reviewSchema } from '@/features/review/review.types';
import { addDoc } from 'firebase/firestore';
import { reviewCollection } from './collection';
import { Protect } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addReview(review: ReviewFormOutput) {
  try {
    await Protect();
    const payload: Review = reviewSchema.parse({ ...review, createdAt: new Date(), helpfulCount: 0 });
    await addDoc(reviewCollection, payload);
    revalidatePath('/orders');
  } catch {
    throw new Error('Error adding review');
  }
}
