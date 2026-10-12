'use server';

import { Review } from '@/features/review/review.types';
import { serverApi } from '@/lib/api/server.api';

const reviewFromApi = (item: Record<string, unknown>): Review => ({
  id: String(item.id),
  buyerEmail: '',
  reviewerName: '',
  productId: String(item.productId),
  orderId: String(item.orderId),
  rating: Number(item.rating),
  comment: String(item.comment),
  media: Array.isArray(item.media) ? item.media.map(String) : [],
  helpfulCount: 0,
  createdAt: String(item.createdAt),
});

export async function getProductReview(productId: number, orderId: string): Promise<Review | null> {
  const reviews = await getAllProductReviews(productId);
  return reviews.find((review) => review.orderId === orderId) ?? null;
}

export async function getAllProductReviews(productId: number): Promise<Review[]> {
  const api = await serverApi();
  const { data } = await api.get(`/reviews/product/${productId}`);
  return (data as Record<string, unknown>[]).map(reviewFromApi);
}
