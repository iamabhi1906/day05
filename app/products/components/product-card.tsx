'use client';
import { useRouter } from 'next/navigation';
import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography, CircularProgress, Container } from '@mui/material';
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
import { Star } from '@mui/icons-material';
import NumberSpinner from '@/components/number-spinner';

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

  const imageUrls = product.imageUrls;
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

  const handleQuantityChange = async (quantity: number) => {
    if (!cartItem) return;
    try {
      setLoading(true);
      if (quantity <= 0) {
        await dispatch(removeUserCartItemAsync({ buyerEmail: userData?.email ?? null, cartId: cartItem.id }));
        setCartItem(null);
        return;
      }
      await dispatch(
        updateUserCartItemQuantityAsync({
          buyerEmail: userData?.email ?? null,
          cartId: cartItem.id,
          quantity: quantity,
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

  return (
    <Card className={styles.card}>
      <Container component={'div'} className={styles.productImageBackground}>
        <Image
          className={styles.mainMedia}
          src={imageUrls[currentDisplayImage]}
          width={1000}
          height={1000}
          alt={product.name}
          loading="eager"
          onClick={() => router.push(`/products/${product.id}`)}
        />
      </Container>
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
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              {product.name}
            </Typography>
            <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 700 }}>
                {currency.format(product.price)}
              </Typography>
              <Stack direction={'row'}>
                <Star color="warning" />
                {/* <Typography>{(Math.random() * (5.0 - 2.0) + 2.0).toFixed(1)}/5.0</Typography> */}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions className={styles.cardActions}>
        {isInCart && cartItem ? (
          <Stack className={styles.cartActionsRow} direction="column" spacing={1}>
            <Button variant="contained" startIcon={<ShoppingCartCheckoutIcon />} onClick={() => router.push('/cart')} fullWidth disabled={loading}>
              Buy now
            </Button>
            <NumberSpinner
              size="small"
              min={1}
              max={product.stock}
              value={cartItem.quantity}
              onChange={(value) => {
                if (value) handleQuantityChange(value);
              }}
            />
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
