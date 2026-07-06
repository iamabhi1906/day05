import { getProduct } from '@/lib/crud/product';
import { Container, Stack, Typography } from '@mui/material';
import ProductImageGallery from './components/product-image-gallery';
import { notFound } from 'next/navigation';
import ProductDetailInfo from './components/product-detail-info';
import ProductControls from './components/product-controls';
import { getAllProductReviews } from '@/services/review/get-review';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();
  const review = await getAllProductReviews(product.id);

  return (
    <Container maxWidth="xl" sx={{ py: 4, paddingTop: 10 }}>
      <Stack direction={'row'} spacing={4}>
        <ProductImageGallery product={product} />
        <Stack>
          <ProductDetailInfo product={product} />
          <ProductControls product={product} />
        </Stack>
      </Stack>
      {review ? JSON.stringify(review) : <Typography>No review for this product yet..!!</Typography>}
    </Container>
  );
}
