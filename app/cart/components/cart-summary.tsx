'use client';
import { currency } from '@/lib/currency';
import { Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import styles from './cart-summary.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { clearUserCartAsync } from '@/features/cart/cart.actions';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlaceAnOrder } from '@/services/orders/create';

export default function CartSummary() {
  const { cartItems, total: cartTotal } = useSelector((state: RootState) => state.cart);
  const { userData } = useSelector((state: RootState) => state.user);

  const [promoCode, setPromoCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [promoMessage, setPromoMessage] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const subtotal = useMemo(() => cartTotal, [cartTotal]);
  const shipping = useMemo(() => (subtotal > 0 ? 0 : 0), [subtotal]);
  const salesTax = useMemo(() => 0, []);
  const total = useMemo(() => subtotal - discount + shipping + salesTax, [subtotal, discount, shipping, salesTax]);
  const itemCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);

  const checkout = async () => {
    try {
      setLoading(true);
      if (!userData) {
        router.push('/login');
        return;
      }
      await PlaceAnOrder(cartItems, promoCode);
      dispatch(clearUserCartAsync({ buyerEmail: userData.email }));
      enqueueSnackbar('Order placed successfully', { variant: 'success' });
    } catch (error: unknown) {
      enqueueSnackbar('Unable to place order.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoMessage('Please enter a promo code to apply.');
      return;
    }
    setPromoMessage('Promo code validation is not enabled yet.');
  };

  return (
    <Paper component={'aside'} className={styles.summary} elevation={2}>
      <Typography className={styles.summaryTitle}>Summary</Typography>
      {/* TODO: Implement this in features */}
      <Stack sx={{ display: 'none' }}>
        <Typography variant="body2">Do you have a promo code?</Typography>
        <Stack direction={'row'} spacing={1}>
          <TextField
            className={styles.promoInput}
            placeholder="Enter promo code"
            size="small"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
          />
          <Button type="button" className={styles.applyButton} variant="contained" disabled={!promoCode.trim()} onClick={applyPromoCode}>
            Apply
          </Button>
        </Stack>
        {promoMessage ? (
          <Typography variant="caption" color="text.secondary">
            {promoMessage}
          </Typography>
        ) : null}
      </Stack>

      <Stack spacing={1.5}>
        <Stack className={`${styles.summaryLine} ${styles.light}`} direction={'row'}>
          <Typography>
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </Typography>
          <Typography>{currency.format(subtotal)}</Typography>
        </Stack>
        <Stack className={styles.summaryLine} direction={'row'}>
          <Typography>Discount</Typography>
          <Typography color="success">- {currency.format(discount)}</Typography>
        </Stack>
        <Stack className={styles.summaryLine} direction={'row'}>
          <Typography>Sales Tax</Typography>
          <Typography>{currency.format(salesTax)}</Typography>
        </Stack>
        <Stack className={styles.summaryLine} direction={'row'}>
          <Typography>Shipping</Typography>
          <Typography>{shipping > 0 ? currency.format(shipping) : 'Free'}</Typography>
        </Stack>
        <Divider />
        <Stack className={styles.summaryLine} direction={'row'}>
          <Typography sx={{ fontWeight: '600' }}>Total</Typography>
          <Typography sx={{ fontWeight: '700' }}>{currency.format(total)}</Typography>
        </Stack>
      </Stack>

      <Button type="button" className={styles.checkoutButton} disabled={loading} variant="contained" onClick={checkout}>
        Checkout
      </Button>
      <Divider />

      <Typography variant="caption" className={styles.helpText}>
        Need help? Call us at 91-6201478596
      </Typography>
    </Paper>
  );
}
