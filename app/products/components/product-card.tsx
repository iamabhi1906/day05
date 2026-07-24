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
      <ProductCardCarousel productId={product.id} productImages={product.productImages} productName={product.title} />
      <ProductCardActions product={product} />
    </Card>
  );
}
