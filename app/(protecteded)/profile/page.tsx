import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Container, Grid, Typography } from '@mui/material';
import ProfileInfo from './components/profile-Info';
import ProfileTabs from './components/profile-tabs';
import styles from './profile.module.css';
import { getBuyerOrders } from '@/services/orders/get-buyer-orders';
import { serverApi } from '@/lib/api/server.api';
import { UserData } from '@/features/user/user.types';
import { addressFromApi } from '@/lib/api/commerce';

export default async function Page() {
  const api = await serverApi();
  const { data: user } = await api.get('/auth/me');
  if (!user) redirect('/login');
  const { data: addressData } = await api.get('/addresses');
  const addresses = (addressData as Record<string, unknown>[]).map(addressFromApi);
  const orders = await getBuyerOrders();

  return (
    <Container className={styles.page}>
      <Typography variant="h4">Profile</Typography>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid size={5} sx={{ height: '100%' }}>
          <ProfileInfo user={user as UserData} orders={orders} />
        </Grid>
        <Grid size={7}>
          <ProfileTabs user={user as UserData} address={addresses} />
        </Grid>
      </Grid>
    </Container>
  );
}
