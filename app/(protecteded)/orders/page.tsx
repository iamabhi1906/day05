import { redirect } from 'next/navigation';
import { Card, Container, Stack, Typography } from '@mui/material';
import { getBuyerOrders } from '@/services/orders/get-buyer-orders';
import OrderProductCard from './components/order-card';
import { serverApi } from '@/lib/api/server.api';

export function groupOrdersById<T extends { orderId: string | number }>(orders: T[]) {
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

  const orders = await getBuyerOrders();
  const groupedOrders = groupOrdersById(orders);

  return (
    <Container>
      <Stack direction={'column'} spacing={1}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          My Orders
        </Typography>
        <Typography variant="caption">Track and manage all your orders in one place</Typography>
      </Stack>
      {groupedOrders.map((groupedOrder, index) => (
        <Card key={`Group-${index}`}>
          <OrderProductCard order={groupedOrder} />
        </Card>
      ))}
    </Container>
  );
}
