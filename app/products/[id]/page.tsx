import { getProduct } from '@/lib/crud/product';
import { Container, Stack, Typography } from '@mui/material';
import ProductImageGallery from './components/product-image-gallery';
import { notFound } from 'next/navigation';
import ProductDetailInfo from './components/product-detail-info';
import ProductControls from './components/product-controls';
import { getAllProductReviews } from '@/services/review/get-review';
import ReviewCard from './components/review-card';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();
  const reviews = await getAllProductReviews(product.id);

  return (
    <Container maxWidth="xl" sx={{ py: 4, paddingTop: 10 }}>
      <Stack direction={'row'} spacing={4}>
        <ProductImageGallery product={product} />
        <Stack>
          <ProductDetailInfo product={product} />
          <ProductControls product={product} />
        </Stack>
      </Stack>
      {reviews ? (
        <Stack direction={'row'} sx={{ paddingTop: 5 }}>
          {reviews.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </Stack>
      ) : (
        <Typography>No review for this product yet..!!</Typography>
      )}
    </Container>
  );
}
