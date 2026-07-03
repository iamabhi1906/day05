import { OrderData, OrderPaymentStatus, OrderStatus } from '@/features/orders/orders.types';
import { LocalShipping } from '@mui/icons-material';
import { Box, Card, Chip, ChipProps, ChipPropsColorOverrides, Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';

interface OrderProductCardProps {
  order: {
    orderId: string;
    products: OrderData[];
  };
}

const getOrderStatusColor = (status: OrderStatus): ChipProps['color'] => {
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
    <Card>
      <Stack direction={'row'} spacing={1}>
        <LocalShipping />
        <Stack>
          <Typography>Order: #{order.orderId}</Typography>
          <Typography variant="caption">Placed on: {new Date(order.products[0].placedAt).toLocaleString()}</Typography>
        </Stack>
      </Stack>
      <Divider />
      {order.products.map((product) => (
        <Box key={product.productId}>
          <Image src={product.productImageUrls[0]} alt={product.productName} height={150} width={150} />
          <Box>
            <Stack>
              <Typography>{product.productName}</Typography>
              <Typography>vendor: {product.vendorEmail}</Typography>
              <Typography>{product.productPrice}</Typography>
              <Typography>Qty: {product.quantity}</Typography>
            </Stack>
            <Stack>
              <Chip
                label={product.paymentStatus}
                variant="filled"
                color={product.paymentStatus === OrderPaymentStatus.PAID ? 'success' : 'warning'}
                sx={{ textTransform: 'capitalize' }}
              />
              <Chip label={product.status} variant={'outlined'} color={getOrderStatusColor(product.status)} sx={{ textTransform: 'capitalize' }} />
            </Stack>
          </Box>
        </Box>
      ))}
    </Card>
  );
}
