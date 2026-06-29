'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Grid, Stack, Alert, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ProductData } from '@/lib/crud/product';
import { CartItemData, addProductToCart, getCartItems, updateCartItemQuantity } from '@/lib/crud/cart';
import { UserData } from '@/lib/crud/user';
import ProductImageGallery from './components/product-image-gallery';
import ProductDetailInfo from './components/product-detail-info';
import ProductQuantityControls from './components/product-quantity-controls';

interface ProductDetailPageProps {
  product: ProductData;
  user: UserData;
  cartItem: CartItemData | null;
}

export default function ProductDetailPage({ product, user, cartItem: initialCartItem }: ProductDetailPageProps) {
  const router = useRouter();
  const [cartItem, setCartItem] = useState<CartItemData | null>(initialCartItem);
  const [adding, setAdding] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addProductToCart(user.email, product);
      const cartItems = await getCartItems(user.email);
      const item = cartItems.find((i) => i.productId === product.id);
      setCartItem(item || null);
      setNotification({ open: true, message: 'Product added to cart!', severity: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotification({ open: true, message: 'Failed to add product to cart', severity: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = async (nextQuantity: number) => {
    if (!cartItem) return;

    const safeQuantity = Math.max(1, nextQuantity);

    try {
      setUpdatingQuantity(true);
      await updateCartItemQuantity(cartItem.id, safeQuantity);
      setCartItem((current) => (current ? { ...current, quantity: safeQuantity } : current));
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      setNotification({ open: true, message: 'Failed to update quantity', severity: 'error' });
    } finally {
      setUpdatingQuantity(false);
    }
  };

  const imageUrls = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];
  const isOutOfStock = product.stock <= 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 3 }}>
        Back
      </Button>

      <Grid container spacing={4}>
        <Grid container size={5}>
          <ProductImageGallery
            imageUrls={imageUrls}
            currentImageIndex={currentImageIndex}
            productName={product.name}
            onSelectImage={setCurrentImageIndex}
          />
        </Grid>

        <Grid container size={6}>
          <Stack spacing={3}>
            <ProductDetailInfo product={product} />
            <Stack spacing={2} sx={{ mt: 3 }}>
              <ProductQuantityControls
                cartItem={cartItem}
                adding={adding}
                updatingQuantity={updatingQuantity}
                isOutOfStock={isOutOfStock}
                productStock={product.stock}
                onAddToCart={handleAddToCart}
                onQuantityChange={handleQuantityChange}
              />
              <Button variant="outlined" size="large" onClick={() => router.push('/products')} fullWidth>
                Continue Shopping
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
