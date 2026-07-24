'use client';

import { ProductData } from '@/features/product/product.types';
import { CardMedia, Stack } from '@mui/material';
import { useState } from 'react';

type ProductImageGalleryProps = {
  product: ProductData;
};

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const productImages = product.productImages;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  function onSelectImage(index: number) {
    setCurrentIndex(index);
  }
  return (
    <Stack spacing={2}>
      <CardMedia
        component="img"
        image={productImages[currentIndex]}
        alt={product.name}
        sx={{
          width: '100%',
          height: 400,
          objectFit: 'cover',
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
        }}
      />
      {productImages.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
          {productImages.map((image, index) => (
            <CardMedia
              key={`${product.name}-${index}`}
              component="img"
              image={image}
              alt={`${product.name} ${index + 1}`}
              onClick={() => onSelectImage(index)}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                flexShrink: 0,
                objectFit: 'cover',
                cursor: 'pointer',
                border: currentIndex === index ? '2px solid #1976d2' : '2px solid #e0e0e0',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#1976d2' },
              }}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
