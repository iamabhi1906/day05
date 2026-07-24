import { Avatar, Box, Button, Chip, Divider, LinearProgress, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { OrderData, OrderPaymentStatus, OrderStatus } from '@/features/orders/orders.types';
import { LocalShippingOutlined } from '@mui/icons-material';
import { currency } from '@/lib/currency';

interface VendorOrderCardProps {
  order: {
    orderId: string;
    products: OrderData[];
  };
  action: (formData: FormData) => Promise<void> | void;
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
    case OrderStatus.IN_TRANSIT:
    case OrderStatus.OUT_FOR_DELIVERY:
      return 'info';
    case OrderStatus.PROCESSING:
      return 'secondary';
    default:
      return 'default';
  }
};

const getProgressValue = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.CREATED:
      return 20;
    case OrderStatus.PROCESSING:
      return 45;
    case OrderStatus.SHIPPED:
      return 70;
    case OrderStatus.IN_TRANSIT:
      return 80;
    case OrderStatus.OUT_FOR_DELIVERY:
      return 90;
    case OrderStatus.DELIVERED:
      return 100;
    case OrderStatus.CANCELLED:
    case OrderStatus.RETURNED:
      return 0;
    default:
      return 20;
  }
};

const statusOptions = Object.values(OrderStatus);

export default function VendorOrderCard({ order, action }: VendorOrderCardProps) {
  const firstProduct = order.products[0];
  const summaryTotal = order.products.reduce((sum, product) => sum + product.productPrice * product.quantity, 0);
  const activeStatus = firstProduct?.status ?? OrderStatus.CREATED;

  return (
    <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, bgcolor: 'grey.50' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}>
                <LocalShippingOutlined fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Order #{order.orderId}
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Placed on {new Date(firstProduct.placedAt).toLocaleString()}
              </Typography>
              <Chip size="small" label={firstProduct.buyerEmail} />
            </Stack>
          </Box>

          <Box component="form" action={action} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, alignItems: 'center' }}>
            <input type="hidden" name="orderId" value={order.orderId} />
            <Select name="status" defaultValue={activeStatus} sx={{ textTransform: 'capitalize' }}>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            <Button type="submit" variant="contained" size="small">
              Update status
            </Button>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <Chip
            label={`${order.products.length} item${order.products.length > 1 ? 's' : ''}`}
            // icon={<ShoppingBagOutlined />}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Total ₹${summaryTotal.toLocaleString()}`}
            // avatar={<ReceiptLongOutlined />}
            color="secondary"
            variant="outlined"
          />
          <Chip label={firstProduct.paymentStatus} color={firstProduct.paymentStatus === OrderPaymentStatus.PAID ? 'success' : 'warning'} />
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" sx={{ mb: 0.7, justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Fulfillment progress
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {activeStatus}
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={getProgressValue(activeStatus)} sx={{ height: 8, borderRadius: 999 }} />
        </Box>

        <Stack spacing={2}>
          {order.products.map((product) => (
            <Box
              key={product.id ?? product.productId}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ width: { xs: '100%', md: 120 }, flexShrink: 0 }}>
                <Image
                  src={product.productproductImages[0]}
                  alt={product.productName}
                  width={120}
                  height={120}
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12 }}
                />
              </Box>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {product.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty: {product.quantity} Price: ₹{product.productPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vendor: {product.vendorEmail}
                </Typography>
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
                  Item total: {currency.format(product.productPrice * product.quantity)}
                </Typography>
              </Box>

              <Stack spacing={1}>
                <Chip label={product.paymentStatus} color={product.paymentStatus === OrderPaymentStatus.PAID ? 'success' : 'warning'} size="small" />
                <Chip label={product.status} color={getOrderStatusColor(product.status)} size="small" />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
