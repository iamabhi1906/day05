'use client';

import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Button, Stack, Typography } from '@mui/material';

type VendorProductsHeaderProps = {
  onAddProduct: () => void;
};

export function VendorProductsHeader({ onAddProduct }: VendorProductsHeaderProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <InventoryIcon color="primary" />
        <Typography variant="h5">Vendor Products</Typography>
      </Stack>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddProduct}>
        Add Product
      </Button>
    </Stack>
  );
}
