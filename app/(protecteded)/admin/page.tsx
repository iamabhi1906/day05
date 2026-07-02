import { redirect } from 'next/navigation';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import { getSession } from '@/lib/auth';
import {  getAllProducts } from '@/lib/crud/product';
import {  getAllUsers, getUserByEmail } from '@/lib/crud/user';
import styles from './admin.module.css';
import ProductCard from './components/ProductCard';
import UserCard from './components/UserCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import { deleteProductAction, deleteUserAction, toggleUserBlockAction } from './services/adminActions';


export default async function AdminPage() {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');

  const currentUser = await getUserByEmail(email);
  if (!currentUser || currentUser.role !== 'admin') redirect('/products');

  const products = await getAllProducts();
  const users = await getAllUsers();

  return (
    <Box className={styles.root}>
      <Stack spacing={3}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Control Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage products and user access from a server-side admin dashboard. Use these actions to remove outdated products, block vendors or buyers, and keep the marketplace healthy.
          </Typography>
        </Box>

        <Box className={styles.section}>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} className={styles.sectionTitleRow}>
            <Typography variant="h5">Product Management</Typography>
            <Chip label={`${products.length} products`} color="primary" />
          </Stack>
          {products.length === 0 ? (
            <LoadingSkeleton count={3} />
          ) : (
            <Grid container spacing={3} className={styles.sectionGrid}>
              {products.map((product) => (
                <Grid key={product.id}>
                  <ProductCard product={product} action={deleteProductAction} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box className={styles.section}>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} className={styles.sectionTitleRow}>
            <Typography variant="h5">User Management</Typography>
            <Chip label={`${users.length} users`} color="secondary" />
          </Stack>
          {users.length === 0 ? (
            <LoadingSkeleton count={3} />
          ) : (
            <Grid container spacing={3} className={styles.sectionGrid}>
              {users.map((user) => {
                const isSelf = user.email === currentUser.email;
                return (
                  <Grid key={user.id}>
                    <UserCard user={user} isSelf={isSelf} toggleAction={toggleUserBlockAction} deleteAction={deleteUserAction} />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
