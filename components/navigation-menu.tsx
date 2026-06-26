import { Box, Button } from '@mui/material';
import Link from 'next/link';
const pages = ['Products', 'Pricing', 'Blog'];

export default function NavigationMenu() {
  return (
    <>
      <Box>
        {pages.map((page) => (
          <Button key={page} color="inherit">
            {page}
          </Button>
        ))}
      </Box>

      <Button color="inherit">
        <Link href={'/login'}>Login</Link>
      </Button>
    </>
  );
}
