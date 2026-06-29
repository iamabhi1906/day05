'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { CartItemData } from '@/lib/crud/cart';
import { ProductData } from '@/lib/crud/product';
import { useState } from 'react';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

type ProductCardProps = {
  product: ProductData;
  cartItem: CartItemData | null;
  loading?: boolean;
  onAddToCart: (product: ProductData) => void;
  onChangeQuantity: (cartItem: CartItemData, quantity: number) => void;
};

export default function ProductCard({ product, cartItem, loading = false, onAddToCart, onChangeQuantity }: ProductCardProps) {
  const router = useRouter();
  const quantity = cartItem?.quantity ?? 0;
  const isInCart = Boolean(cartItem);
  const isOutOfStock = product.stock <= 0;

  const [currentDisplayImage, setCurrentDisplayImage] = useState<number>(0);

  const imageUrls = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={imageUrls[currentDisplayImage]}
        alt={product.name}
        sx={{ height: 220, objectFit: 'cover', cursor: 'pointer' }}
        onClick={() => router.push(`/products/${product.id}`)}
      />
      {imageUrls.length > 1 ? (
        <Stack direction="row" spacing={1} sx={{ p: 1, overflowX: 'auto' }}>
          {imageUrls.slice(0, 4).map((image, index) => (
            <CardMedia
              key={image}
              component="img"
              image={image}
              onClick={() => {
                setCurrentDisplayImage(index);
              }}
              alt={product.name}
              sx={{ width: 72, height: 72, borderRadius: 1, flexShrink: 0, objectFit: 'cover' }}
            />
          ))}
        </Stack>
      ) : null}
      <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push(`/products/${product.id}`)}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
              {product.name}
            </Typography>
            <Chip label={product.category} size="small" color="primary" />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
            {product.description}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {currency.format(product.price)}
            </Typography>
            <Chip
              label={isOutOfStock ? 'Out of stock' : `${product.stock} available`}
              size="small"
              color={isOutOfStock ? 'error' : product.stock <= 5 ? 'warning' : 'success'}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Sold by {product.vendorName}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        {isInCart && cartItem ? (
          <Stack spacing={1.5} sx={{ width: '100%' }} direction="row">
            <Button variant="contained" startIcon={<ShoppingCartCheckoutIcon />} onClick={() => router.push('/cart')} fullWidth>
              Buy now
            </Button>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <IconButton
                color="primary"
                aria-label="decrease quantity"
                disabled={loading || quantity <= 1}
                onClick={() => onChangeQuantity(cartItem, quantity - 1)}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ minWidth: 24, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton
                color="primary"
                aria-label="increase quantity"
                disabled={loading || isOutOfStock || quantity >= product.stock}
                onClick={() => onChangeQuantity(cartItem, quantity + 1)}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Stack>
        ) : (
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            disabled={loading || isOutOfStock}
            onClick={() => onAddToCart(product)}
            fullWidth
          >
            {isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
