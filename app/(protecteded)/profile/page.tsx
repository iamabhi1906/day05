import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getUserAddresses } from '@/lib/crud/address';
import { getUserByEmail } from '@/lib/crud/user';
import { Container, Grid, Typography } from '@mui/material';
import ProfileInfo from './components/profile-Info';
import ProfileTabs from './components/profile-tabs';
import styles from './profile.module.css';
import { getBuyerOrders } from '@/services/orders/get-buyer-orders';
import { serverApi } from '@/lib/api/server.api';
import { UserData } from '@/features/user/user.types';

export default async function Page() {
  const api = await serverApi();
  const user: UserData = await api.get('/auth/me');
  if (!user) redirect('/login');
  const addresses = await getUserAddresses(user.email);
  const orders = await getBuyerOrders(user);

  return (
    <Container className={styles.page}>
      <Typography variant="h4">Profile</Typography>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid size={5} sx={{ height: '100%' }}>
          <ProfileInfo user={user} orders={orders} />
        </Grid>
        <Grid size={7}>
          <ProfileTabs user={user} address={addresses} />
        </Grid>
      </Grid>
    </Container>
  );
}
