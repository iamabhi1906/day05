import { ProductData } from '@/features/product/product.types';
import { Card } from '@mui/material';
import ProductCardCarousel from './product-card-carousel';
import ProductCardActions from './product-card-actions';

interface ProductCardProps {
  product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <ProductCardCarousel productId={product.id} imageUrls={product.imageUrls} productName={product.name} />
      <ProductCardActions product={product} />
    </Card>
  );
}
