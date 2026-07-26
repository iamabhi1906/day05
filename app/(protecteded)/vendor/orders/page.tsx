import { redirect } from 'next/navigation';
import { Container, Stack, Typography, Alert } from '@mui/material';
import { getVendorOrders } from '@/services/orders/vendor-orders';
import VendorOrderCard from './components/vendor-order-card';
import { updateVendorOrderStatus } from './actions';
import { OrderData } from '@/features/orders/orders.types';
import { serverApi } from '@/lib/api/server.api';

function groupOrdersById<T extends { orderId: string | number }>(orders: T[]) {
  return Object.values(
    orders.reduce(
      (acc, order) => {
        const key = String(order.orderId);
        if (!acc[key]) {
          acc[key] = {
            orderId: key,
            products: [],
          };
        }
        acc[key].products.push(order);
        return acc;
      },
      {} as Record<string, { orderId: string; products: T[] }>,
    ),
  );
}

export default async function Page() {
  const api = await serverApi();
  const { data: user } = await api.get('/auth/me');
  if (!user) redirect('/login');
  if (user.role !== 'vendor') redirect('/products');

  const orders = await getVendorOrders();
  const groupedOrders = groupOrdersById<OrderData>(orders);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Vendor orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review each customer order, inspect item details, and update fulfilment progress with confidence.
          </Typography>
        </Stack>

        {groupedOrders.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            No orders are assigned to your store yet.
          </Alert>
        ) : (
          <Stack spacing={2.5}>
            {groupedOrders.map((groupedOrder) => (
              <VendorOrderCard key={groupedOrder.orderId} order={groupedOrder} action={updateVendorOrderStatus} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
