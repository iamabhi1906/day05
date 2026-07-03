import { ShoppingCartCheckout } from '@mui/icons-material';
import { Button, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import styles from './cart-empty.module.css';

export default function EmptyCart() {
  return (
    <Container className={styles.page}>
      <Stack sx={{ alignItems: 'center' }} spacing={2}>
        <ShoppingCartCheckout sx={{ fontSize: 250 }} />
        <Typography variant="h4">Your Cart is Currently Empty...!!</Typography>
        <Stack sx={{ alignItems: 'center' }}>
          <Typography variant="caption">Before proceed to checkout you must add some products to your Shopping cart.</Typography>
          <Typography variant="caption">You will find a lot of interesting product on our "Products" page</Typography>
        </Stack>
        <Button LinkComponent={Link} href="/products" variant="contained">
          Return to Products
        </Button>
      </Stack>
    </Container>
  );
}
