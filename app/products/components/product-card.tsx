'use client';
import { useRouter } from 'next/navigation';
import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useEffect, useState } from 'react';
import styles from './product-card.module.css';
import Image from 'next/image';
import { ProductData } from '@/features/product/product.types';
import { CartData } from '@/features/cart/cart.types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
  addUserCartItemAsync,
  getUserProductCartItemAsync,
  removeUserCartItemAsync,
  updateUserCartItemQuantityAsync,
} from '@/features/cart/cart.actions';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

type ProductCardProps = {
  product: ProductData;
};

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [cartItem, setCartItem] = useState<CartData | null>(null);
  const [currentDisplayImage, setCurrentDisplayImage] = useState<number>(0);

  const imageUrls =
    product.imageUrls?.filter((url): url is string => typeof url === 'string' && url.length > 0) ?? (product.imageUrl ? [product.imageUrl] : []);
  const quantity = cartItem?.quantity ?? 0;
  const isInCart = Boolean(cartItem);
  const isOutOfStock = product.stock <= 0;

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        setLoading(true);
        const result = await dispatch(
          getUserProductCartItemAsync({
            buyerEmail: userData?.email ?? null,
            productId: product.id,
          }),
        ).unwrap();
        setCartItem(result);
      } catch {
        setCartItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItem();
  }, [userData?.email, product.id, dispatch]);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await dispatch(addUserCartItemAsync({ buyerEmail: userData?.email ?? null, product }));
      const result = await dispatch(
        getUserProductCartItemAsync({
          buyerEmail: userData?.email ?? null,
          productId: product.id,
        }),
      ).unwrap();
      setCartItem(result);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseQuantity = async () => {
    if (!cartItem) return;
    const nextQuantity = Math.max(0, quantity - 1);
    try {
      setLoading(true);
      if (nextQuantity <= 0) {
        await dispatch(removeUserCartItemAsync({ buyerEmail: userData?.email ?? null, cartId: cartItem.id }));
        setCartItem(null);
        return;
      }
      await dispatch(
        updateUserCartItemQuantityAsync({
          buyerEmail: userData?.email ?? null,
          cartId: cartItem.id,
          quantity: nextQuantity,
        }),
      );
      const result = await dispatch(
        getUserProductCartItemAsync({
          buyerEmail: userData?.email ?? null,
          productId: product.id,
        }),
      ).unwrap();
      setCartItem(result);
    } catch (error) {
      console.error('Failed to decrease quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = async () => {
    if (!cartItem || isOutOfStock) return;
    try {
      await dispatch(addUserCartItemAsync({ buyerEmail: userData?.email ?? null, product }));
      const result = await dispatch(
        getUserProductCartItemAsync({
          buyerEmail: userData?.email ?? null,
          productId: product.id,
        }),
      ).unwrap();
      setCartItem(result);
    } catch (error) {
      console.error('Failed to increase quantity:', error);
    }
  };

  return (
    <Card className={styles.card}>
      <Image
        className={styles.mainMedia}
        src={imageUrls[currentDisplayImage]}
        width={1000}
        height={1000}
        alt={product.name}
        loading="eager"
        onClick={() => router.push(`/products/${product.id}`)}
      />
      <CardContent className={styles.cardContent}>
        <Stack direction="column" spacing={1}>
          {imageUrls.length > 0 ? (
            <Stack direction="row" spacing={1}>
              {imageUrls.slice(0, 4).map((image, index) => (
                <Image
                  key={image}
                  className={`${styles.thumbnail} ${currentDisplayImage === index ? styles.thumbnailActive : ''}`}
                  loading="eager"
                  src={image}
                  onClick={() => {
                    setCurrentDisplayImage(index);
                  }}
                  width={1000}
                  height={1000}
                  alt={product.name}
                />
              ))}
            </Stack>
          ) : null}
          <Stack spacing={1}>
            <Typography variant="h6" className={styles.productName}>
              {product.name}
            </Typography>
            <Typography variant="h6" className={styles.price}>
              {currency.format(product.price)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions className={styles.cardActions}>
        {isInCart && cartItem ? (
          <Stack spacing={1.5} className={styles.cartActionsRow} direction="row">
            <Button variant="contained" startIcon={<ShoppingCartCheckoutIcon />} onClick={() => router.push('/cart')} fullWidth disabled={loading}>
              Buy now
            </Button>
            <Stack direction="row" spacing={1} className={styles.quantityControls}>
              <IconButton color="primary" aria-label="decrease quantity" disabled={loading || quantity <= 1} onClick={handleDecreaseQuantity}>
                {loading ? <CircularProgress size={24} /> : <RemoveIcon />}
              </IconButton>
              <Typography variant="body1" className={styles.quantityText}>
                {quantity}
              </Typography>
              <IconButton
                color="primary"
                aria-label="increase quantity"
                disabled={loading || isOutOfStock || quantity >= product.stock}
                onClick={handleIncreaseQuantity}
              >
                {loading ? <CircularProgress size={24} /> : <AddIcon />}
              </IconButton>
            </Stack>
          </Stack>
        ) : (
          <Button variant="contained" startIcon={<AddShoppingCartIcon />} disabled={loading || isOutOfStock} onClick={handleAddToCart} fullWidth>
            {loading ? <CircularProgress size={20} /> : isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
