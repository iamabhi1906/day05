import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getUserAddresses } from '@/lib/crud/address';
import { getUserByEmail } from '@/lib/crud/user';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import ProfileInfo from './components/profile-Info';
import { getBuyerOrders } from '@/lib/crud/order';
import ProfileTabs from './components/profile-tabs';
import styles from './profile.module.css';

export default async function Page() {
  const session = await getSession();
  const email = session?.email;

  if (!email) redirect('/login');

  const user = await getUserByEmail(email);
  if (!user) redirect('/login');
  const addresses = await getUserAddresses(email);
  const orders = await getBuyerOrders(email);

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
