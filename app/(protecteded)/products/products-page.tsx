'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { addProductToCart } from '@/lib/crud/cart';
import { ProductData } from '@/lib/crud/product';
import { UserData } from '@/lib/crud/user';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductsPage({ products, user }: { products: ProductData[]; user: UserData }) {
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const addToCart = async (product: ProductData) => {
    try {
      setLoadingProductId(product.id);
      await addProductToCart(user.email, product);
      setNotification({ open: true, message: 'Product added to cart.', severity: 'success' });
    } catch {
      setNotification({ open: true, message: 'Unable to add product to cart.', severity: 'error' });
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
        <StorefrontIcon color="primary" />
        <Typography variant="h5">Products</Typography>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" image={product.imageUrl} alt={product.name} sx={{ height: 220 }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Chip label={product.category} size="small" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="subtitle1">{currency.format(product.price)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sold by {product.vendorName}
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  disabled={loadingProductId === product.id || product.stock <= 0}
                  onClick={() => addToCart(product)}
                  fullWidth
                >
                  {product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {products.length === 0 ? (
        <Stack sx={{ py: 8, alignItems: 'center' }}>
          <Typography color="text.secondary">No published products are available.</Typography>
        </Stack>
      ) : null}

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
}
