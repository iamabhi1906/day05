import { Grid } from '@mui/material';
import SideInfo from './side-info';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) redirect('/');
  return (
    <Grid container>
      <Grid size={4}>{children}</Grid>
      <Grid size={8}>
        <SideInfo />
      </Grid>
    </Grid>
  );
}
