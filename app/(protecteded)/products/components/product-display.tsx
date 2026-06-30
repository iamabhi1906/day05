'use client';
import { addProductToCart, CartItemData, getCartItems, updateCartItemQuantity } from '@/lib/crud/cart';
import { getPublishedProducts, ProductData } from '@/lib/crud/product';
import { Alert, Grid, Snackbar, Box, CircularProgress, Typography } from '@mui/material';
import ProductCard from './product-card';
import { useState, useCallback } from 'react';
import { UserData } from '@/lib/crud/user';
import InfiniteScroll from 'react-infinite-scroll-component';

interface props {
  products: ProductData[];
  cart: CartItemData[];
  user: UserData;
  lastDoc: string | null;
}

export default function ProductDisplay({ user, products, cart, lastDoc }: props) {
  const [cartItems, setCartItems] = useState<CartItemData[]>(cart);
  const [LocalProducts, setProducts] = useState<ProductData[]>(products);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const [currentLastDocId, setCurrentLastDocId] = useState<string | null>(lastDoc);
  const [hasMore, setHasMore] = useState<boolean>(lastDoc !== null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchMoreProducts = useCallback(async () => {
    if (isLoadingMore || !currentLastDocId) return;
    setIsLoadingMore(true);
    try {
      const { data, lastDocId } = await getPublishedProducts({ lastDocId: currentLastDocId });
      if (data.length > 0) {
        setProducts((current) => [...current, ...data]);
        setCurrentLastDocId(lastDocId);
        setHasMore(lastDocId !== null);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
      setNotification({ open: true, message: 'Failed to load more products.', severity: 'error' });
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentLastDocId, isLoadingMore]);

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
    <>
      <InfiniteScroll
        dataLength={LocalProducts.length}
        next={fetchMoreProducts}
        hasMore={hasMore && !isLoadingMore}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        }
        endMessage={<Typography color="error" align='center'>No more products to load</Typography>}
      >
        <Grid container spacing={3} columns={10}>
          {LocalProducts.map((product) => {
            const cartItem = cartItems.find((item) => item.productId === product.id) ?? null;
            return (
              <Grid key={product.id} size={{ xs: 2 }}>
                <ProductCard
                  product={product}
                  cartItem={cartItem}
                  onAddToCart={addToCart}
                  onChangeQuantity={changeQuantity}
                  loading={loadingProductId === product.id}
                />
              </Grid>
            );
          })}
        </Grid>
      </InfiniteScroll>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification((current) => ({ ...current, open: false }))}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </>
  );
}
