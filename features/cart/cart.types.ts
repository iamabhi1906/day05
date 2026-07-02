import z from 'zod';

export const CartSchema = z.object({
  id: z.string(),
  buyerEmail: z.email().nullable(),
  productId: z.string(),
  productName: z.string(),
  productImageUrls: z.array(z.string()),
  vendorEmail: z.string(),
  price: z.number(),
  quantity: z.number(),
  addedAt: z.string().nullable().optional(),
});

export type CartData = z.infer<typeof CartSchema>;
export interface CartState {
  cartItem: CartData[];
  loading: boolean;
  error: string | null;
  total: number;
}
