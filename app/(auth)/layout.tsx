import { Grid } from '@mui/material';
import SideInfo from './side-info';
import { redirect } from 'next/navigation';
import { serverApi } from '@/lib/api/server.api';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const api = await serverApi();
  const { data: user } = await api.get('/auth/me');
  if (user) redirect('/');
  return (
    <Grid container>
      <Grid size={4}>{children}</Grid>
      <Grid size={8}>
        <SideInfo />
      </Grid>
    </Grid>
  );
}
