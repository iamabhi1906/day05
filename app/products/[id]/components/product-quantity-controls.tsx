'use client';

import { Button, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import { CartItemData } from '@/lib/crud/cart';

type ProductQuantityControlsProps = {
  cartItem: CartItemData | null;
  adding: boolean;
  updatingQuantity: boolean;
  isOutOfStock: boolean;
  productStock: number;
  onAddToCart: () => void | Promise<void>;
  onQuantityChange: (nextQuantity: number) => void | Promise<void>;
};

export default function ProductQuantityControls({
  cartItem,
  adding,
  updatingQuantity,
  isOutOfStock,
  productStock,
  onAddToCart,
  onQuantityChange,
}: ProductQuantityControlsProps) {
  if (cartItem) {
    return (
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', justifyContent: 'space-between', border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 2, py: 1.5 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Quantity
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <IconButton
            color="primary"
            aria-label="decrease quantity"
            disabled={updatingQuantity || cartItem.quantity <= 1}
            onClick={() => onQuantityChange(cartItem.quantity - 1)}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 24, textAlign: 'center' }}>
            {cartItem.quantity}
          </Typography>
          <IconButton
            color="primary"
            aria-label="increase quantity"
            disabled={updatingQuantity || isOutOfStock || cartItem.quantity >= productStock}
            onClick={() => onQuantityChange(cartItem.quantity + 1)}
          >
            <AddIcon />
          </IconButton>
        </Stack>
      </Stack>
    );
  }

  return (
    <Button variant="contained" size="large" startIcon={<AddShoppingCartIcon />} onClick={onAddToCart} disabled={isOutOfStock || adding} fullWidth>
      {adding ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}
