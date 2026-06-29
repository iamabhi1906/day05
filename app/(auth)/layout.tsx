import { Grid } from '@mui/material';
import SideInfo from './side-info';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid container>
      <Grid size={4}>{children}</Grid>
      <Grid size={8}>
        <SideInfo />
      </Grid>
    </Grid>
  );
}
