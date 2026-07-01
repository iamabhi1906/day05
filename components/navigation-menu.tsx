'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, Badge, Box, Button, Chip, Popover, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { getUserCartItemsAsync } from '@/features/cart/cart.actions';
import { resetCartState } from '@/features/cart/cart.slice';
import { clearUserData } from '@/features/user/user.slice';
import { AccountCircle, Inventory, LocalMall, Login, Logout, ReceiptLong, ShoppingCart } from '@mui/icons-material';
import styles from './css/navigation.module.css';

const buyerPages = [
  { label: 'Products', href: '/products', icon: <LocalMall fontSize="small" /> },
  { label: 'Cart', href: '/cart', icon: <ShoppingCart fontSize="small" /> },
  { label: 'Orders', href: '/orders', icon: <ReceiptLong fontSize="small" /> },
];

const vendorPages = [
  { label: 'Products', href: '/products', icon: <LocalMall fontSize="small" /> },
  { label: 'Manage', href: '/vendor/products', icon: <Inventory fontSize="small" /> },
  { label: 'Orders', href: '/vendor/orders', icon: <ReceiptLong fontSize="small" /> },
  { label: 'Profile', href: '/profile', icon: <AccountCircle fontSize="small" /> },
];

export default function NavigationMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const { userData: user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const { cartItem, loading: cartLoading } = useSelector((state: RootState) => state.cart);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pages = user?.role === 'vendor' ? vendorPages : buyerPages;
  const cartCount = useMemo(() => cartItem.reduce((total, item) => total + item.quantity, 0), [cartItem]);

  useEffect(() => {
    void dispatch(getUserCartItemsAsync({ buyerEmail: user?.email ?? null }));
  }, [dispatch, user?.email]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      dispatch(clearUserData());
      dispatch(resetCartState());
      setIsLoggingOut(false);
      setAnchorEl(null);
      router.replace('/login');
    }
  };

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <Box className={styles.navRoot}>
      <Box className={styles.navLinks}>
        {pages.map((page) => {
          if (!isAuthenticated && page.href === '/orders') return null;
          const isCartRoute = page.href === '/cart';

          return (
            <Button
              key={page.href}
              component={Link}
              href={page.href}
              color="inherit"
              className={styles.navLinkButton}
              startIcon={
                isCartRoute ? (
                  <Badge badgeContent={cartCount} color="secondary" max={99}>
                    {page.icon}
                  </Badge>
                ) : (
                  page.icon
                )
              }
            >
              {page.label}
            </Button>
          );
        })}
      </Box>

      {isAuthenticated && user ? (
        <Box className={styles.profileSection}>
          <Chip
            avatar={
              <Avatar alt={user.name ?? user.email} src={user.avatar ?? undefined} className={styles.profileAvatar}>
                {(user.name ?? user.email ?? 'U').charAt(0).toUpperCase()}
              </Avatar>
            }
            label={
              <Typography variant="caption" className={styles.profileChipLabel}>
                {user.name?.split(' ')[0] ?? user.email}
              </Typography>
            }
            className={styles.profileChip}
            aria-describedby={isPopoverOpen ? 'profile-popover' : undefined}
            onClick={(event) => setAnchorEl(event.currentTarget as unknown as HTMLDivElement)}
          />
          <Popover
            id="profile-popover"
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { className: styles.popoverSheet } }}
          >
            <Link href={'/profile'} className={styles.profileMenuLink}>
              <Button fullWidth className={styles.profileMenuButton}>
                Profile
              </Button>
            </Link>
            <Button
              color="error"
              variant="outlined"
              onClick={handleLogout}
              disabled={isLoggingOut || cartLoading}
              className={styles.logoutButton}
              startIcon={<Logout fontSize="small" />}
            >
              {isLoggingOut ? 'Signing out...' : 'Logout'}
            </Button>
          </Popover>
        </Box>
      ) : (
        <Button component={Link} href="/login" color="inherit" className={styles.loginButton} startIcon={<Login fontSize="small" />}>
          Login
        </Button>
      )}
    </Box>
  );
}
