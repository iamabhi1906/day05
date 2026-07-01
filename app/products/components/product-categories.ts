import { ProductCategory } from '@/features/product/product.types';

export const categories = [
  { label: 'All products', value: null },

  { label: 'Groceries', value: ProductCategory.GROCERIES },
  { label: 'Home Decoration', value: ProductCategory.HOME_DECORATION },
  { label: 'Kitchen Accessories', value: ProductCategory.KITCHEN_ACCESSORIES },
  { label: 'Laptops', value: ProductCategory.LAPTOPS },
  { label: "Men's Shirts", value: ProductCategory.MENS_SHIRTS },
  { label: "Men's Shoes", value: ProductCategory.MENS_SHOES },
  { label: "Men's Watches", value: ProductCategory.MENS_WATCHES },
  { label: 'Mobile Accessories', value: ProductCategory.MOBILE_ACCESSORIES },
  { label: 'Motorcycle', value: ProductCategory.MOTORCYCLE },
  { label: 'Skin Care', value: ProductCategory.SKIN_CARE },
  { label: 'Smartphones', value: ProductCategory.SMARTPHONES },
  { label: 'Sports Accessories', value: ProductCategory.SPORTS_ACCESSORIES },
  { label: 'Sunglasses', value: ProductCategory.SUNGLASSES },
  { label: 'Tablets', value: ProductCategory.TABLETS },
  { label: 'Tops', value: ProductCategory.TOPS },
] as const;
