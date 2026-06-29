'use client';

import { useEffect, useState } from 'react';
import { Alert, Box, Grid, Snackbar, Stack, Typography } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ProductCard from './components/product-card';
import { addProductToCart, CartItemData, getCartItems, updateCartItemQuantity } from '@/lib/crud/cart';
import { ProductData } from '@/lib/crud/product';
import { UserData } from '@/lib/crud/user';

export default function ProductsPage({ products, user }: { products: ProductData[]; user: UserData }) {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const loadCartItems = async () => {
      const items = await getCartItems(user.email);
      setCartItems(items);
    };

    void loadCartItems();
  }, [user.email]);

  const addToCart = async (product: ProductData) => {
    try {
      setLoadingProductId(product.id);
      await addProductToCart(user.email, product);
      const refreshedItems = await getCartItems(user.email);
      setCartItems(refreshedItems);
      setNotification({ open: true, message: 'Product added to cart.', severity: 'success' });
    } catch {
      setNotification({ open: true, message: 'Unable to add product to cart.', severity: 'error' });
    } finally {
      setLoadingProductId(null);
    }
  };

  const changeQuantity = async (cartItem: CartItemData, quantity: number) => {
    const safeQuantity = Math.max(1, quantity);
    try {
      setLoadingProductId(cartItem.productId);
      await updateCartItemQuantity(cartItem.id, safeQuantity);
      setCartItems((current) => current.map((item) => (item.id === cartItem.id ? { ...item, quantity: safeQuantity } : item)));
    } catch {
      setNotification({ open: true, message: 'Unable to update quantity.', severity: 'error' });
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
        {products.map((product) => {
          const cartItem = cartItems.find((item) => item.productId === product.id) ?? null;

          return (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}> 
              <ProductCard
                product={product}
                cartItem={cartItem}
                loading={loadingProductId === product.id}
                onAddToCart={addToCart}
                onChangeQuantity={changeQuantity}
              />
            </Grid>
          );
        })}
      </Grid>

      {products.length === 0 ? (
        <Stack sx={{ py: 8, alignItems: 'center' }}>
          <Typography color="text.secondary">No published products are available.</Typography>
        </Stack>
      ) : null}

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification((current) => ({ ...current, open: false }))}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
}
