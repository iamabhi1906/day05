import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be a positive number').min(1, 'Price is required'),
  stock: z.coerce.number().nonnegative('Stock must be a non-negative number').min(0, 'Stock is required'),
  status: z.enum(['draft', 'published'], { message: 'Please select a valid status' }),
  imageUrls: z.array(z.url('Invalid image URL')).min(1, 'At least one image is required'),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
