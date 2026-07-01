'use client';

import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { ProductData } from '@/features/product/product.types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

type ProductDetailInfoProps = {
  product: ProductData;
};

export default function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
            {product.name}
          </Typography>
          <Chip label={product.category} color="primary" />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
            {currency.format(product.price)}
          </Typography>
          <Chip
            label={isOutOfStock ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
            color={isOutOfStock ? 'error' : product.stock <= 5 ? 'warning' : 'success'}
            size="small"
          />
        </Stack>
      </Stack>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Description
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {product.description}
        </Typography>
      </Box>

      <Box>
        <Stack direction="row" spacing={1}>
          <StorefrontIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Sold by
          </Typography>
        </Stack>
        <Typography variant="body2">{product.vendorName}</Typography>
        <Typography variant="caption" color="text.secondary">
          {product.vendorEmail}
        </Typography>
      </Box>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Product Details
        </Typography>
        <Grid container spacing={2}>
          <Grid container>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body2">{product.status}</Typography>
          </Grid>
          <Grid container>
            <Typography variant="caption" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body2">{product.category}</Typography>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
