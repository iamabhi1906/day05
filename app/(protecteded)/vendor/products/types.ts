import { ProductData } from '@/features/product/product.types';
import type { ProductStatus } from '@/lib/crud/product';

export type ProductFormState = {
  id: string | null;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  imageUrl: string;
  imageUrls: string[];
  imagePublicId: string;
  imagePublicIds: string[];
  status: ProductStatus;
};

export type NotificationState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

export type CloudinaryInfo = {
  secure_url?: string;
  public_id?: string;
};

export const productCategories = ['Clothing', 'Accessories', 'Footwear', 'Beauty', 'Home', 'Gadgets', 'Sports'];

export const emptyForm: ProductFormState = {
  id: null,
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  imageUrl: '',
  imageUrls: [],
  imagePublicId: '',
  imagePublicIds: [],
  status: 'draft',
};

export type ProductTableRowProps = {
  product: ProductData;
  onEdit: (product: ProductData) => void;
  onDelete: (productId: string) => void;
};
