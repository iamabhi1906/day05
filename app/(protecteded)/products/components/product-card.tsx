'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, CardActions, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { CartItemData } from '@/lib/crud/cart';
import { ProductData } from '@/lib/crud/product';
import { useState } from 'react';
import styles from './product-card.module.css';
import Image from 'next/image';

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
    <Card className={styles.card}>
      <CardMedia
        component="img"
        className={styles.mainMedia}
        image={imageUrls[currentDisplayImage]}
        alt={product.name}
        onClick={() => router.push(`/products/${product.id}`)}
      />
      <CardContent className={styles.cardContent}>
        <Stack direction="column" spacing={1}>
          {imageUrls.length > 0 ? (
            <Stack direction="row" spacing={1}>
              {imageUrls.slice(0, 4).map((image, index) => (
                <Image
                  key={image}
                  className={`${styles.thumbnail} ${currentDisplayImage === index ? styles.thumbnailActive : ''}`}
                  src={image}
                  onClick={() => {
                    setCurrentDisplayImage(index);
                  }}
                  width={1000}
                  height={1000}
                  alt={product.name}
                />
              ))}
            </Stack>
          ) : null}
          <Stack spacing={1}>
            <Typography variant="h6" className={styles.productName}>
              {product.name}
            </Typography>
            <Typography variant="h6" className={styles.price}>
              {currency.format(product.price)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions className={styles.cardActions}>
        {isInCart && cartItem ? (
          <Stack spacing={1.5} className={styles.cartActionsRow} direction="row">
            <Button variant="contained" startIcon={<ShoppingCartCheckoutIcon />} onClick={() => router.push('/cart')} fullWidth>
              Buy now
            </Button>
            <Stack direction="row" spacing={1} className={styles.quantityControls}>
              <IconButton
                color="primary"
                aria-label="decrease quantity"
                disabled={loading || quantity <= 1}
                onClick={() => onChangeQuantity(cartItem, quantity - 1)}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" className={styles.quantityText}>
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
