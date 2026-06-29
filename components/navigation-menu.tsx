'use server';
import { Box, Button } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LoginIcon from '@mui/icons-material/Login';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { UserData } from '@/lib/crud/user';

const buyerPages = [
  { label: 'Products', href: '/products', icon: <LocalMallIcon fontSize="small" /> },
  { label: 'Cart', href: '/cart', icon: <ShoppingCartIcon fontSize="small" /> },
  { label: 'Orders', href: '/orders', icon: <ReceiptLongIcon fontSize="small" /> },
];

const vendorPages = [
  { label: 'Products', href: '/products', icon: <LocalMallIcon fontSize="small" /> },
  { label: 'Manage', href: '/vendor/products', icon: <InventoryIcon fontSize="small" /> },
];

export default async function NavigationMenu({ user }: { user?: UserData }) {
  const pages = user?.role === 'vendor' ? vendorPages : buyerPages;

  return (
    <>
      <Box>
        {pages.map((page) => (
          <Button key={page.href} color="inherit" component={Link} href={page.href} startIcon={page.icon}>
            {page.label}
          </Button>
        ))}
      </Box>

      {!user ? (
        <Button color="inherit" component={Link} href="/login" startIcon={<LoginIcon fontSize="small" />}>
          Login
        </Button>
      ) : null}
    </>
  );
}
