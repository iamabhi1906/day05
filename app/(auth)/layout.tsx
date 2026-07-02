import { Grid } from '@mui/material';
import SideInfo from './side-info';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // if (session)
  //   return (
  //     <Dialog open={true} aria-labelledby="logged-in-dialog-title" aria-describedby="logged-in-dialog-description" role="alertdialog">
  //       <DialogTitle id="logged-in-dialog-title">You are already logged in!</DialogTitle>
  //       <DialogContent>
  //         <DialogContentText id="logged-in-dialog-description">
  //           You are already signed into your account. Please head back to the home page to continue.
  //         </DialogContentText>
  //       </DialogContent>
  //       <DialogActions>
  //         <Button href="/" variant="contained" color="primary" autoFocus>
  //           Go to home
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   );

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
