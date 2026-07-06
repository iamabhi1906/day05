import z from 'zod';

export const reviewSchema = z.object({
  id: z.string().optional(),
  buyerEmail: z.email('Buyer Email is required.!'),
  reviewerName: z.string().min(3, 'Name should be minimum 3 char long').max(30, 'Name must be at most 30 char long'),
  productId: z.string('Product Id is required'),
  orderId: z.string('Order id is required'),
  rating: z.coerce.number().min(1, 'Minimum 1 start is allowed').max(5, 'Maximum 5 star is allowed'),
  comment: z.string('Valid string is required').max(500, 'Maximum of 500 characters').optional(),
  media: z.array(z.string()).default([]),
  helpfulCount: z.number(),
  createdAt: z.coerce.string(),
});

export const reviewInputSchema = reviewSchema.omit({
  id: true,
  helpfulCount: true,
  createdAt: true,
});

export type ReviewFormInput = z.input<typeof reviewInputSchema>;
export type ReviewFormOutput = z.input<typeof reviewInputSchema>;
export type ReviewForm = z.infer<typeof reviewInputSchema>;
export type Review = z.infer<typeof reviewSchema>;
