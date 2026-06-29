'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CardMedia,
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartItemData, removeCartItem, updateCartItemQuantity } from '@/lib/crud/cart';
import { placeOrder } from '@/lib/crud/order';
import { UserData } from '@/lib/crud/user';

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

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

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
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
        <ShoppingCartIcon color="primary" />
        <Typography variant="h5">Cart</Typography>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="right">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <CardMedia component="img" image={item.productImageUrl} alt={item.productName} sx={{ width: 56, height: 56, borderRadius: 1 }} />
                    <Typography variant="subtitle2">{item.productName}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{currency.format(item.price)}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(event) => changeQuantity(item, Number(event.target.value))}
                    slotProps={{ htmlInput: { min: 1 } }}
                    sx={{ width: 96 }}
                  />
                </TableCell>
                <TableCell>{currency.format(item.price * item.quantity)}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => removeItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Stack sx={{ py: 5, alignItems: 'center' }}>
                    <Typography color="text.secondary">Your cart is empty.</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mt: 3, justifyContent: 'flex-end', alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <Typography variant="h6">Total: {currency.format(total)}</Typography>
        <Button variant="contained" startIcon={<PaymentIcon />} disabled={loading || items.length === 0} onClick={checkout}>
          Place order
        </Button>
      </Stack>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
}
