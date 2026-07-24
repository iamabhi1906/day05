'use client';
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Rating, Stack, Typography } from '@mui/material';
import { LocalShipping, Reviews, SupportAgent } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import styles from './order-product-card.module.css';
import { OrderData, OrderPaymentStatus, OrderStatus } from '@/features/orders/orders.types';
import { buildChatId } from '@/lib/chat';
import { currency } from '@/lib/currency';
import AddOrderReview from './add-order-review-dialog-box';
import { useEffect, useState } from 'react';
import { Review } from '@/features/review/review.types';
import { getProductReview } from '@/services/review/get-review';

interface OrderProductCardProps {
  order: {
    orderId: string;
    products: OrderData[];
  };
}

const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.CANCELLED:
    case OrderStatus.RETURNED:
      return 'error';

    case OrderStatus.CREATED:
      return 'warning';

    case OrderStatus.DELIVERED:
      return 'success';

    case OrderStatus.SHIPPED:
      return 'info';

    default:
      return 'default';
  }
};

export default function OrderProductCard({ order }: OrderProductCardProps) {
  return (
    <Card className={styles.card} elevation={2}>
      <CardContent className={styles.header}>
        <Stack direction="row" spacing={2}>
          <Avatar className={styles.avatar}>
            <LocalShipping />
          </Avatar>

          <Box>
            <Typography variant="h6">Order #{order.orderId}</Typography>

            <Typography variant="body2" color="text.secondary">
              Placed on {new Date(order.products[0].placedAt).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <Divider />

      {order.products.map((product, index) => (
        <Box key={product.productId}>
          <OrderCard order={product} showReview={true} />
          {index !== order.products.length - 1 && <Divider />}
        </Box>
      ))}
    </Card>
  );
}

export function OrderCard({ order, showReview = false }: { order: OrderData; showReview?: boolean }) {
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [review, setReview] = useState<Review | null>(null);
  async function fetchReview(productId: string, orderId: string) {
    const review = await getProductReview(productId, orderId);
    setReview(review);
  }

  useEffect(() => {
    if (showReview) fetchReview(order.productId, order.orderId.toString());
  }, [order]);
  return (
    <Box key={order.productId}>
      <Box className={styles.product}>
        <div className={styles.imageWrapper}>
          <Image src={order.productproductImages[0]} alt={order.productName} width={120} height={120} className={styles.image} />
        </div>

        <Box className={styles.details}>
          <Typography variant="h6" className={styles.productName}>
            {order.productName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Vendor: {order.vendorEmail}
          </Typography>

          <Typography className={styles.price}>{currency.format(order.productPrice)}</Typography>

          <Typography variant="body2">Quantity: {order.quantity}</Typography>
        </Box>

        <Stack spacing={1} className={styles.statusSection}>
          <Chip
            label={order.paymentStatus}
            color={order.paymentStatus === OrderPaymentStatus.PAID ? 'success' : 'warning'}
            sx={{ textTransform: 'uppercase' }}
          />
          <Chip label={order.status} variant="filled" color={getOrderStatusColor(order.status)} sx={{ textTransform: 'uppercase' }} />
          <Stack direction={'row'} spacing={2}>
            {order.status === OrderStatus.DELIVERED && (
              <Button href={`/orders/chats/${buildChatId(order.productId, order.orderId)}`} LinkComponent={Link} variant="outlined">
                <Stack direction={'row'} spacing={1}>
                  <SupportAgent />
                  <Typography>Need help?</Typography>
                </Stack>
              </Button>
            )}
            {order.status === OrderStatus.DELIVERED &&
              showReview &&
              (review ? (
                <Rating name="read-only" value={review.rating} readOnly />
              ) : (
                <Button variant="outlined" startIcon={<Reviews />} onClick={() => setIsReviewing(true)}>
                  Add Review
                </Button>
              ))}
          </Stack>
        </Stack>
      </Box>
      <AddOrderReview open={isReviewing} onClose={() => setIsReviewing(false)} order={order} />
    </Box>
  );
}
