import { ProductCategory } from '@/features/product/product.types';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import type { SvgIconTypeMap } from '@mui/material';
import {
  BeachAccess,
  BikeScooter,
  Checkroom,
  DirectionsRun,
  Headset,
  Inventory2,
  Kitchen,
  Laptop,
  LocalGroceryStore,
  Smartphone,
  Spa,
  SportsSoccer,
  Tablet,
  Watch,
  Weekend,
} from '@mui/icons-material';

type CategoryIcon = OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;

export const categories: ReadonlyArray<{
  label: string;
  value: ProductCategory | null;
  icon: CategoryIcon;
}> = [
  { label: 'All products', value: null, icon: Inventory2 },
  { label: 'Groceries', value: ProductCategory.GROCERIES, icon: LocalGroceryStore },
  { label: 'Home Decoration', value: ProductCategory.HOME_DECORATION, icon: Weekend },
  { label: 'Kitchen Accessories', value: ProductCategory.KITCHEN_ACCESSORIES, icon: Kitchen },
  { label: 'Laptops', value: ProductCategory.LAPTOPS, icon: Laptop },
  { label: "Men's Shirts", value: ProductCategory.MENS_SHIRTS, icon: Checkroom },
  { label: "Men's Shoes", value: ProductCategory.MENS_SHOES, icon: DirectionsRun },
  { label: "Men's Watches", value: ProductCategory.MENS_WATCHES, icon: Watch },
  { label: 'Mobile Accessories', value: ProductCategory.MOBILE_ACCESSORIES, icon: Headset },
  { label: 'Motorcycle', value: ProductCategory.MOTORCYCLE, icon: BikeScooter },
  { label: 'Skin Care', value: ProductCategory.SKIN_CARE, icon: Spa },
  { label: 'Smartphones', value: ProductCategory.SMARTPHONES, icon: Smartphone },
  { label: 'Sports Accessories', value: ProductCategory.SPORTS_ACCESSORIES, icon: SportsSoccer },
  { label: 'Sunglasses', value: ProductCategory.SUNGLASSES, icon: BeachAccess },
  { label: 'Tablets', value: ProductCategory.TABLETS, icon: Tablet },
  { label: 'Tops', value: ProductCategory.TOPS, icon: Checkroom },
];
