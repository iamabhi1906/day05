'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Stack } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LoginIcon from '@mui/icons-material/Login';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { UserData } from '@/lib/crud/user';
import { ReceiptLong } from '@mui/icons-material';

const buyerPages = [
  { label: 'Products', href: '/products', icon: <LocalMallIcon fontSize="small" /> },
  { label: 'Cart', href: '/cart', icon: <ShoppingCartIcon fontSize="small" /> },
  { label: 'Orders', href: '/orders', icon: <ReceiptLongIcon fontSize="small" /> },
];

const vendorPages = [
  { label: 'Products', href: '/products', icon: <LocalMallIcon fontSize="small" /> },
  { label: 'Manage', href: '/vendor/products', icon: <InventoryIcon fontSize="small" /> },
  { label: 'Orders', href: '/vendor/orders', icons: <ReceiptLong fontSize="small" /> },
];

export default function NavigationMenu({ user }: { user?: UserData }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pages = user?.role === 'vendor' ? vendorPages : buyerPages;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <Stack direction="row" spacing={1} sx={{ ml: 'auto', alignItems: 'center' }}>
      <Box>
        {pages.map((page) => (
          <Button key={page.href} color="inherit" href={page.href} startIcon={page.icon}>
            {page.label}
          </Button>
        ))}
      </Box>

      {!user ? (
        <Button color="inherit" href="/login" startIcon={<LoginIcon fontSize="small" />}>
          Login
        </Button>
      ) : (
        <Button color="inherit" variant="outlined" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? 'Signing out' : 'Logout'}
        </Button>
      )}
    </Stack>
  );
}
