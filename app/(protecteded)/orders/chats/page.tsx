import { redirect } from 'next/navigation';
import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/crud/user';
import { getBuyerOrders } from '@/services/orders/get-buyer-orders';
import { buildChatId } from '@/lib/chat';
import { OrderCard } from '../components/order-card';

export default async function BuyerChatsPage() {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');
  const user = await getUserByEmail(email);
  if (!user) redirect('/login');
  const orders = await getBuyerOrders();
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Your support chats
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start or continue conversations tied to your orders.
          </Typography>
        </Box>

        {orders.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary">You do not have any orders yet.</Typography>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const chatId = buildChatId(order.productId, order.orderId);
            return (
              <Box key={chatId}>
                <OrderCard order={order} />
              </Box>
            );
          })
        )}
      </Stack>
    </Container>
  );
}
