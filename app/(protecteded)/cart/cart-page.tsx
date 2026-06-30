'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
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
} from '@mui/material';
import { CartItemData, removeCartItem, updateCartItemQuantity } from '@/lib/crud/cart';
import { placeOrder } from '@/lib/crud/order';
import { UserData } from '@/lib/crud/user';
import styles from './cart-page.module.css';
import Image from 'next/image';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

export default function CartPage({ initialItems, user }: { initialItems: CartItemData[]; user: UserData }) {
  const [items, setItems] = useState<CartItemData[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const changeQuantity = async (item: CartItemData, quantity: number) => {
    const safeQuantity = Math.max(1, quantity);
    setItems((current) => current.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, quantity: safeQuantity } : currentItem)));
    await updateCartItemQuantity(item.id, safeQuantity);
  };

  const removeItem = async (itemId: string) => {
    await removeCartItem(itemId);
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  const checkout = async () => {
    try {
      setLoading(true);
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
                          <Image src={item.productImageUrl} width={1000} height={1000} alt={item.productName} className={styles.productImage} />
                          <Stack>
                            <Typography variant="h6">{item.productName}</Typography>
                            <Typography color="secondary">Item no: {item.productId}</Typography>
                            <Typography color="secondary">Qty: {item.quantity}</Typography>
                            <div className={styles.productActions}>
                              <Button className={styles.actionButton} onClick={() => removeItem(item.id)}>
                                Remove
                              </Button>
                              <Button className={styles.actionButton} onClick={() => changeQuantity(item, item.quantity)}>
                                Edit
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
