'use client';

import { CardMedia, Stack } from '@mui/material';

type ProductImageGalleryProps = {
  imageUrls: string[];
  currentImageIndex: number;
  productName: string;
  onSelectImage: (index: number) => void;
};

export default function ProductImageGallery({ imageUrls, currentImageIndex, productName, onSelectImage }: ProductImageGalleryProps) {
  return (
    <Stack spacing={2}>
      <CardMedia
        component="img"
        image={imageUrls[currentImageIndex]}
        alt={productName}
        sx={{
          width: '100%',
          height: 400,
          objectFit: 'cover',
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
        }}
      />
      {imageUrls.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
          {imageUrls.map((image, index) => (
            <CardMedia
              key={`${productName}-${index}`}
              component="img"
              image={image}
              alt={`${productName} ${index + 1}`}
              onClick={() => onSelectImage(index)}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                flexShrink: 0,
                objectFit: 'cover',
                cursor: 'pointer',
                border: currentImageIndex === index ? '2px solid #1976d2' : '2px solid #e0e0e0',
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
