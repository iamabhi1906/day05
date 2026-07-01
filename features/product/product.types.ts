import z from 'zod';

export enum ProductCategory {
  GROCERIES = 'groceries',
  HOME_DECORATION = 'home-decoration',
  KITCHEN_ACCESSORIES = 'kitchen-accessories',
  LAPTOPS = 'laptops',
  MENS_SHIRTS = 'mens-shirts',
  MENS_SHOES = 'mens-shoes',
  MENS_WATCHES = 'mens-watches',
  MOBILE_ACCESSORIES = 'mobile-accessories',
  MOTORCYCLE = 'motorcycle',
  SKIN_CARE = 'skin-care',
  SMARTPHONES = 'smartphones',
  SPORTS_ACCESSORIES = 'sports-accessories',
  SUNGLASSES = 'sunglasses',
  TABLETS = 'tablets',
  TOPS = 'tops',
  VEHICLE = 'vehicle',
  WOMENS_BAGS = 'womens-bags',
  WOMENS_DRESSES = 'womens-dresses',
  WOMENS_JEWELLERY = 'womens-jewellery',
}

export enum ProductStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

export interface ProductSortByOptions {
  field: 'price' | 'createdAt' | null;
  order: 'asc' | 'desc';
}

export interface GetPublishedProductsParams {
  limit?: number;
  search?: string;
  lastDocId?: string | null;
  category?: string | null;
  sortBy?: ProductSortByOptions | null;
}

export const ProductSchema = z.object({
  id: z.string({ error: 'Product ID is required' }),

  name: z
    .string({ error: 'Product name is required' })
    .min(5, { error: 'Product name must be at least 5 characters long' })
    .max(100, { error: 'Product name cannot exceed 100 characters' }),

  description: z
    .string({ error: 'Product description is required' })
    .min(10, { error: 'Description must be at least 10 characters long' })
    .max(300, { error: 'Description cannot exceed 300 characters' }),

  price: z
    .number({ error: 'Price is required' })
    .min(1, { error: 'Price must be at least 1' })
    .max(1000000, { error: 'Price cannot exceed 1000000' }),

  stock: z
    .number({ error: 'Stock quantity is required' })
    .min(10, { error: 'Minimum initial stock must be 10 units' })
    .max(10000, { error: 'Stock cannot exceed 10,000 units' }),

  category: z.enum(ProductCategory, { error: 'Please select a valid product category' }),

  imageUrl: z.url({ error: 'Main image must be a valid URL' }).nullable().optional(),

  imageUrls: z
    .array(z.url({ error: 'Each item must be a valid image URL' }), {
      error: (issue) => (issue.input === undefined ? 'Please upload at least one product image' : undefined),
    })
    .min(1, { error: 'You must provide at least 1 product image' })
    .max(10, { error: 'You cannot upload more than 10 product images' }),

  imagePublicId: z.string().nullable().optional(),

  imagePublicIds: z
    .array(z.string({ error: 'Public ID must be a string' }))
    .min(1, { error: 'At least one image public ID is required' })
    .max(10, { error: 'Maximum of 10 image public IDs allowed' }),

  status: z.enum(ProductStatus, { error: 'Please select a valid product status' }),

  vendorEmail: z.email({ error: 'Please enter a valid vendor email address' }),

  vendorName: z.string({ error: 'Vendor name is required' }).min(2, { error: 'Vendor name must be at least 2 characters long' }),

  createdAt: z.coerce.date().nullable().optional(),

  updatedAt: z.coerce.date().nullable().optional(),
});

export type ProductData = z.infer<typeof ProductSchema>;

export interface ProductState {
  products: ProductData[];
  product: ProductData | null;
  loading: boolean;
  error: string | null;
}
