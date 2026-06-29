'use client';

import InventoryIcon from '@mui/icons-material/Inventory';
import { Stack, Typography } from '@mui/material';

export function VendorProductsHeader() {
  return (
    <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
      <InventoryIcon color="primary" />
      <Typography variant="h5">Vendor Products</Typography>
    </Stack>
  );
}
