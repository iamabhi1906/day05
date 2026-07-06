import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { LocalShipping, SupportAgent } from '@mui/icons-material';
import Image from 'next/image';
import styles from './order-product-card.module.css';
import { OrderData, OrderPaymentStatus, OrderStatus } from '@/features/orders/orders.types';

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
          <Box className={styles.product}>
            <div className={styles.imageWrapper}>
              <Image src={product.productImageUrls[0]} alt={product.productName} width={120} height={120} className={styles.image} />
            </div>

            <Box className={styles.details}>
              <Typography variant="h6" className={styles.productName}>
                {product.productName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Vendor: {product.vendorEmail}
              </Typography>

              <Typography className={styles.price}>₹{product.productPrice}</Typography>

              <Typography variant="body2">Quantity: {product.quantity}</Typography>
            </Box>

            <Stack spacing={1} className={styles.statusSection}>
              <Chip
                label={product.paymentStatus}
                color={product.paymentStatus === OrderPaymentStatus.PAID ? 'success' : 'warning'}
                sx={{ textTransform: 'uppercase' }}
              />
              <Chip label={product.status} variant="filled" color={getOrderStatusColor(product.status)} sx={{ textTransform: 'uppercase' }} />
              {product.status === OrderStatus.DELIVERED && (
                <Button variant="outlined">
                  <Stack direction={'row'} spacing={1}>
                    <SupportAgent />
                    <Typography>Need help?</Typography>
                  </Stack>
                </Button>
              )}
            </Stack>
          </Box>

          {index !== order.products.length - 1 && <Divider />}
        </Box>
      ))}
    </Card>
  );
}
