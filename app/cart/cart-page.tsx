'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { placeOrder } from '@/lib/crud/order';
import styles from './cart-page.module.css';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { CartData } from '@/features/cart/cart.types';
import { removeUserCartItem } from '@/services/cart/remove.cart';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/crud/user';
import { updateUserCartItemQuantityAsync, removeUserCartItemAsync, getUserCartItemsAsync } from '@/features/cart/cart.actions';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

export default function CartPage() {
  const { cartItem } = useSelector((state: RootState) => state.cart);
  const { userData: user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [items, setItems] = useState<CartData[]>(cartItem);
  const [loading, setLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const removeItem = async (itemId: string) => {
    await dispatch(removeUserCartItemAsync({ cartId: itemId, buyerEmail: user?.email || null }));
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    if (user?.email) {
      dispatch(getUserCartItemsAsync({ buyerEmail: user.email }));
    } else {
      dispatch(getUserCartItemsAsync({ buyerEmail: null }));
    }
  }, [dispatch, user?.email]);

  useEffect(() => {
    setItems(cartItem);
  }, [cartItem]);

  const handleIncreaseQuantity = async (item: CartData) => {
    try {
      setLoadingItemId(item.id);
      await dispatch(
        updateUserCartItemQuantityAsync({
          buyerEmail: user?.email ?? null,
          cartId: item.id,
          quantity: item.quantity + 1,
        }),
      ).unwrap();
      setItems((current) => current.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)));
    } catch (error) {
      console.error('Failed to increase quantity:', error);
      setNotification({
        open: true,
        message: 'Failed to update quantity',
        severity: 'error',
      });
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleDecreaseQuantity = async (item: CartData) => {
    try {
      setLoadingItemId(item.id);
      const nextQuantity = Math.max(0, item.quantity - 1);
      if (nextQuantity <= 0) {
        await removeItem(item.id);
        setNotification({
          open: true,
          message: 'Item removed from cart',
          severity: 'success',
        });
        return;
      }
      await dispatch(
        updateUserCartItemQuantityAsync({
          buyerEmail: user?.email ?? null,
          cartId: item.id,
          quantity: nextQuantity,
        }),
      ).unwrap();
      setItems((current) => current.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: nextQuantity } : cartItem)));
    } catch (error) {
      console.error('Failed to decrease quantity:', error);
      setNotification({
        open: true,
        message: 'Failed to update quantity',
        severity: 'error',
      });
    } finally {
      setLoadingItemId(null);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      if (!user) {
        router.replace('/login');
        return;
      }
      await placeOrder(user.email, items);
      setItems([]);
      setNotification({ open: true, message: 'Order placed.', severity: 'success' });
    } catch (error: unknown) {
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Unable to place order.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cartPage}>
      <Box component={'header'} className={styles.header}>
        <Typography variant="h6">My Shopping Bag</Typography>
      </Box>

      <Box className={styles.content}>
        <Container component={'section'} className={styles.cartItems}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className={styles.cartHeader}>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <TableRow key={item.id} className={styles.cartRow}>
                      <TableCell className={styles.productCell}>
                        <Box className={styles.productCellInner}>
                          <Image
                            src={item.productImageUrls[0] || ''}
                            width={1000}
                            height={1000}
                            alt={item.productName}
                            className={styles.productImage}
                          />
                          <Stack>
                            <Typography variant="h6">{item.productName}</Typography>
                            <Typography color="secondary">Product code: {item.productId}</Typography>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                color="primary"
                                disabled={loadingItemId === item.id}
                                onClick={() => handleDecreaseQuantity(item)}
                                aria-label="decrease quantity"
                              >
                                {loadingItemId === item.id ? <CircularProgress size={20} /> : <RemoveIcon fontSize="small" />}
                              </IconButton>
                              <Typography variant="body2" sx={{ minWidth: '24px', textAlign: 'center' }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                color="primary"
                                disabled={loadingItemId === item.id}
                                onClick={() => handleIncreaseQuantity(item)}
                                aria-label="increase quantity"
                              >
                                {loadingItemId === item.id ? <CircularProgress size={20} /> : <AddIcon fontSize="small" />}
                              </IconButton>
                            </Stack>
                            <div className={styles.productActions}>
                              <Button className={styles.actionButton} onClick={() => removeItem(item.id)}>
                                Remove
                              </Button>
                            </div>
                          </Stack>
                        </Box>
                      </TableCell>
                      <TableCell className={styles.priceCell}>{currency.format(item.price)}</TableCell>
                      <TableCell className={styles.totalCell}>{currency.format(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography className={styles.emptyMessage}>Your cart is empty.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <aside className={styles.summary}>
          <Typography className={styles.summaryTitle}>Summary</Typography>
          <Stack>
            <Typography className={styles.promoLabel}>Do you have a promo code?</Typography>
            <Stack className={styles.promoForm} direction={'row'}>
              <TextField className={styles.promoInput} placeholder="Enter promo code" size="small" />
              <Button type="button" className={styles.applyButton} variant="contained">
                Apply
              </Button>
            </Stack>
          </Stack>

          <Stack className={`${styles.summaryLine} ${styles.light}`} direction={'row'}>
            <Typography>Subtotal</Typography>
            <Typography>{currency.format(subtotal)}</Typography>
          </Stack>
          <Stack className={styles.summaryLine} direction={'row'}>
            <Typography>Shipping</Typography>
            <Typography>TBD</Typography>
          </Stack>
          <Stack className={styles.summaryLine} direction={'row'}>
            <Typography>Sales Tax</Typography>
            <Typography>{currency.format(0)}</Typography>
          </Stack>
          <Stack className={styles.estimateTotal} direction={'row'}>
            <Typography>Estimated Total</Typography>
            <Typography>{currency.format(subtotal)}</Typography>
          </Stack>

          <Button type="button" className={styles.checkoutButton} disabled={loading || items.length === 0} onClick={checkout} variant="contained">
            Checkout
          </Button>

          <Typography className={styles.helpText}>Need help? Call us at 91-6201478596</Typography>
        </aside>
      </Box>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification((current) => ({ ...current, open: false }))}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </div>
  );
}
