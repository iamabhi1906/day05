import { ProductCategory } from '@/features/product/product.types';
import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string('product name is required').min(2, 'Name must be at least 2 characters').min(1, 'Name is required'),
  description: z.string('Product Description is required').min(10, 'Description must be at least 10 characters').min(1, 'Description is required'),
  category: z.enum(ProductCategory, 'Required a valid Product category'),
  price: z.coerce.number('Need a valid price').positive('Price must be a positive number').min(1, 'Price is required'),
  stock: z.coerce.number('Need a valid stock number').nonnegative('Stock must be a non-negative number').min(10, 'At lest 10 Stock is required'),
  status: z.enum(['draft', 'published'], { message: 'Please select a valid status' }),
  imageUrls: z.array(z.url('Invalid image URL'), 'Need at lest one product image').min(1, 'At least one image is required'),
});

export type ProductFormDataInput = z.input<typeof ProductSchema>;
export type ProductFormDataOutput = z.input<typeof ProductSchema>;
export type ProductFormData = z.infer<typeof ProductSchema>;
