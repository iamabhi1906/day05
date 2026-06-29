'use client';

import { Box, Card, CardContent, CardMedia, Chip, Divider, Stack, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { OrderData } from '@/lib/crud/order';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

export default function OrdersPage({
  orders,
  showBuyerEmail = false,
  title = 'Orders',
}: {
  orders: OrderData[];
  showBuyerEmail?: boolean;
  title?: string;
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
        <ReceiptLongIcon color="primary" />
        <Typography variant="h5">{title}</Typography>
      </Stack>

      <Stack spacing={2}>
        {orders.map((order) => (
          <Card key={order.id} variant="outlined">
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1">Order {order.id}</Typography>
                  {showBuyerEmail ? (
                    <Typography variant="caption" color="text.secondary">
                      Buyer: {order.buyerEmail}
                    </Typography>
                  ) : null}
                  <Typography variant="caption" color="text.secondary">
                    {order.createdAt ? order.createdAt.toLocaleString() : 'Processing date'}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Chip label={order.status} color="success" size="small" />
                  <Typography variant="subtitle1">{currency.format(order.total)}</Typography>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5}>
                {order.items.map((item) => (
                  <Stack key={`${order.id}-${item.productId}`} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <CardMedia component="img" image={item.productImageUrl} alt={item.productName} sx={{ width: 56, height: 56, borderRadius: 1 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">{item.productName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{currency.format(item.price * item.quantity)}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 ? (
          <Stack sx={{ py: 8, alignItems: 'center' }}>
            <Typography color="text.secondary">No orders yet.</Typography>
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}
