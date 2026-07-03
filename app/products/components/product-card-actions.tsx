'use client';

import { Box, Button, CardActions, CircularProgress, Stack, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { CartData } from '@/features/cart/cart.types';
import NumberSpinner from '@/components/number-spinner';
import styles from './product-card.module.css';
import { ProductData } from '@/features/product/product.types';
import { useEffect, useState } from 'react';
import { UserData } from '@/features/user/user.types';
import { FavoriteBorder } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { addUserCartItemAsync, getUserProductCartItemAsync, updateUserCartItemQuantityAsync } from '@/features/cart/cart.actions';
import { enqueueSnackbar } from 'notistack';
import { currency } from '@/lib/currency';

type ProductCardActionsProps = {
  product: ProductData;
};

export default function ProductCardActions({ product }: ProductCardActionsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { userData } = useSelector((state: RootState) => state.user);
  const [productInCart, setProductInCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const foundProductInCart = cartItems.find((item) => item.productId === product.id);
    setProductInCart(foundProductInCart ?? null);
  }, [cartItems, product]);

  async function AddToCart() {
    try {
      console.log('I am hit');
      setLoading(true);
      await dispatch(addUserCartItemAsync({ buyerEmail: userData?.email ?? null, product }));
      enqueueSnackbar('Product Add to cart', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error Add Product to cart', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleQuantityChange = async (quantity: number | null) => {
    if (!productInCart || quantity === null) return;
    try {
      setLoading(true);
      await dispatch(
        updateUserCartItemQuantityAsync({
          buyerEmail: userData?.email ?? null,
          cartId: productInCart.id,
          quantity,
        }),
      );
      const result = await dispatch(
        getUserProductCartItemAsync({
          buyerEmail: userData?.email ?? null,
          productId: product.id,
        }),
      ).unwrap();

      setProductInCart(result);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      enqueueSnackbar('Failed to update quantity', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.cardActions}>
      <Stack spacing={2}>
        <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
          <Typography noWrap>{product.name}</Typography>
          <FavoriteBorder />
        </Stack>
        <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{currency.format(product.price)}</Typography>
          {productInCart ? (
            <NumberSpinner
              min={1}
              max={product.stock}
              value={productInCart.quantity ?? 0}
              onChange={handleQuantityChange}
              disabled={loading}
              size="small"
            />
          ) : (
            <Button variant="contained" onClick={() => AddToCart()} disabled={loading}>
              Add to cart
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
