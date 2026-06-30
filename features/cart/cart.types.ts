import z from "zod";


const CartSchema = z.object({
    id: z.string(),
  buyerEmail: z.email(),
  productId: z.string(),
  productName: z.string(),
  productImageUrl: z.string(),
  vendorEmail: string;
  price: number;
  quantity: number;
  addedAt: Date | null;
})