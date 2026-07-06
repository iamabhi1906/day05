import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { VendorProtect } from '@/lib/auth';
import { getVendorOrders } from '@/services/orders/vendor-orders';
import type { OrderData } from '@/features/orders/orders.types';
import { buildChatId } from '@/lib/chat';
export default async function VendorChatsPage() {
  try {
    await VendorProtect();
  } catch {
    redirect('/products');
  }

  const orders = await getVendorOrders();

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Buyer support chats
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review conversations linked to your orders.
          </Typography>
        </Box>

        {orders.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary">You do not have any active chats yet.</Typography>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const chatId = buildChatId(order.productId, order.orderId);

            return (
              <Card key={chatId} variant="outlined">
                <CardContent>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}
                    spacing={1}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>Order #{order.orderId}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.productName} • {order.buyerEmail}
                      </Typography>
                    </Box>
                    <Button href={`/vendor/chats/${chatId}`} variant="contained">
                      View chat
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>
    </Container>
  );
}
