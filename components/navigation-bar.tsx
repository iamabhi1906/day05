import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import MainLogo from './main-logo';
import NavigationMenu from './navigation-menu';
import styles from '@/components/css/navigation.module.css';
import { UserData } from '@/lib/crud/user';

export default function NavigationBar({ user }: { user?: UserData }) {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MainLogo width={40} fill="#fff" />
          <Typography variant="h6" className={`${styles.logoTypography}`}>
            StyleStreet
          </Typography>

          <NavigationMenu user={user} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
