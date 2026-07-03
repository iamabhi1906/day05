'use client';
import { Box, Container, Divider, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import EmptyCart from './components/cart-empty';
import CartSummary from './components/cart-summary';
import CartProductCard from './components/cart-product-card';

export default function Page() {
  const { cartItems } = useSelector((state: RootState) => state.cart);
  return (
    <Container maxWidth="xl" sx={{width: '100%'}}>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <Container sx={{ pt: 10, display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Paper sx={{ flex: 1 }}>
            {cartItems.map((cartItem) => (
              <Box component={'section'} key={cartItem.id}>
                <CartProductCard cartItem={cartItem} />
                <Divider />
              </Box>
            ))}
          </Paper>
          <CartSummary />
        </Container>
      )}
    </Container>
  );
}
