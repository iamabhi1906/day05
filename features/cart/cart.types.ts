import z from 'zod';

export const CartSchema = z.object({
  id: z.number(),
  buyerEmail: z.email().nullable(),
  productId: z.number(),
  productName: z.string(),
  productproductImages: z.array(z.string()),
  vendorEmail: z.string(),
  price: z.number(),
  quantity: z.number(),
  addedAt: z.string().nullable().optional(),
});

export type CartData = z.infer<typeof CartSchema>;
export interface CartState {
  cartItems: CartData[];
  loading: boolean;
  error: string | null;
  total: number;
}
