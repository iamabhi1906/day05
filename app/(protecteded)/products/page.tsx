import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getPublishedProducts } from '@/lib/crud/product';
import { getUserByEmail } from '@/lib/crud/user';
import { Box, Stack, Typography } from '@mui/material';
import { Storefront } from '@mui/icons-material';
import ProductDisplay from './components/product-display';
import { getCartItems } from '@/lib/crud/cart';

export default async function Page() {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');

  const user = await getUserByEmail(email);
  if (!user) redirect('/login');

  const { data, lastDocId } = await getPublishedProducts({});
  const cart = await getCartItems(user.email);

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
        <Storefront color="primary" />
        <Typography variant="h5">Products</Typography>
      </Stack>
      <ProductDisplay products={data} cart={cart} user={user} lastDoc={lastDocId} />
    </Box>
  );
}
