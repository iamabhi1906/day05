'use client';

import { Button, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { CartData } from '@/features/cart/cart.types';
import { useEffect, useState } from 'react';
import { addUserCartItemAsync, getUserProductCartItemAsync, updateUserCartItemQuantityAsync } from '@/features/cart/cart.actions';
import { enqueueSnackbar } from 'notistack';
import NumberSpinner from '@/components/number-spinner';
import { ShoppingBag } from '@mui/icons-material';
import Link from 'next/link';
import { ApiProduct } from '@/lib/crud/product';

type ProductControlsProps = {
  product: ApiProduct;
};

export default function ProductControls({ product }: ProductControlsProps) {
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
    } catch {
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
  if (productInCart) {
    return (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
        <Button startIcon={<ShoppingBag />} size="large" fullWidth variant="contained" LinkComponent={Link} href="/cart">
          Buy Now
        </Button>
        <NumberSpinner
          // label="Quantity Change"
          value={productInCart.quantity}
          onChange={(quantity) => handleQuantityChange(quantity)}
          max={product.stock}
          min={1}
          size="small"
        />
      </Stack>
    );
  }

  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<AddShoppingCartIcon />}
      onClick={AddToCart}
      disabled={product.stock <= 0 || loading}
      fullWidth
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}
