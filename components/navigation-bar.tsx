import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import MainLogo from './main-logo';
import NavigationMenu from './navigation-menu';
import styles from '@/components/css/navigation.module.css';
import Link from 'next/link';

export default function NavigationBar() {
  return (
    <AppBar position="static" sx={{ position: 'fixed', zIndex: 10 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href={'/'} className={styles.navLogo}>
            <MainLogo width={40} fill="#fff" />
            <Typography variant="h6" className={`${styles.logoTypography}`}>
              StyleStreet
            </Typography>
          </Link>
          <NavigationMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
