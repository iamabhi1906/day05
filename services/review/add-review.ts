'use server';

import { ReviewFormOutput } from '@/features/review/review.types';
import { serverApi } from '@/lib/api/server.api';
import { revalidatePath } from 'next/cache';

export async function addReview(review: ReviewFormOutput) {
  const api = await serverApi();
  await api.post('/reviews', {
    orderId: Number(review.orderId),
    productId: Number(review.productId),
    rating: review.rating,
    comment: review.comment,
    media: review.media ?? [],
  });
  revalidatePath('/orders');
}
