'use client';
import { CartData } from '@/features/cart/cart.types';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import styles from './cart-product-card.module.css';
import { currency } from '@/lib/currency';
import NumberSpinner from '@/components/number-spinner';
import { Close, FavoriteBorder } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { removeUserCartItemAsync, updateUserCartItemQuantityAsync } from '@/features/cart/cart.actions';
import { getProduct } from '@/lib/crud/product';
import { enqueueSnackbar } from 'notistack';

interface CartProductCardProps {
  cartItem: CartData;
}

export default function CartProductCard({ cartItem }: CartProductCardProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.user);
  const [stock, setStock] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        const product = await getProduct(cartItem.productId);
        if (!mounted) return;
        setStock(product?.stock ?? 0);
      } catch (error) {
        console.error('Failed to fetch product for stock:', error);
        if (mounted) setStock(0);
      }
    };
    if (cartItem?.productId) fetchProduct();
    return () => {
      mounted = false;
    };
  }, [cartItem.productId]);

  const handleQuantityChange = async (quantity: number | null) => {
    if (!cartItem || quantity === null) return;
    try {
      setLoading(true);
      await dispatch(
        updateUserCartItemQuantityAsync({
          buyerEmail: userData?.email ?? null,
          cartId: cartItem.id,
          quantity,
        }),
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
      enqueueSnackbar('Failed to update quantity', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.cartProductCard}>
      <Image src={cartItem.productImageUrls[0]} width={100} height={100} alt={cartItem.productName} className={styles.productImage} />
      <Stack direction={'row'} sx={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <Stack>
          <Typography sx={{ fontWeight: 600, fontSize: 22 }}>{cartItem.productName}</Typography>
          <Typography variant="caption">Price: {currency.format(cartItem.price)} / per item</Typography>
        </Stack>
        <Stack sx={{ alignItems: 'end' }}>
          <Typography sx={{ fontWeight: 700 }}>{currency.format(cartItem.price * cartItem.quantity)}</Typography>
          <Stack direction={'row'} sx={{ alignItems: 'center' }} spacing={1}>
            <NumberSpinner
              value={cartItem.quantity}
              onChange={(quantity) => {
                handleQuantityChange(quantity);
              }}
              min={1}
              max={stock ?? undefined}
              disabled={loading}
              size="small"
            />
            <IconButton color="primary">
              <FavoriteBorder />
            </IconButton>
            <IconButton
              color="error"
              onClick={async () => {
                await dispatch(removeUserCartItemAsync({ buyerEmail: userData?.email ?? null, cartId: cartItem.id }));
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
