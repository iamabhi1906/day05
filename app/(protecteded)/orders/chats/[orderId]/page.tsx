import { notFound, redirect } from 'next/navigation';
import { Container, Stack, Typography } from '@mui/material';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/crud/user';
import OrderChatPanel from '@/components/order-chat-panel';
import { getBuyerOrders } from '@/services/orders/get-buyer-orders';
import { parseChatId } from '@/lib/chat';
import ProductInfoCard from '@/components/product-info-card';

interface BuyerChatPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function BuyerChatPage({ params }: BuyerChatPageProps) {
  const { orderId } = await params;

  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');

  const user = await getUserByEmail(email);
  if (!user) redirect('/login');

  const orders = await getBuyerOrders();
  const { productId, orderId: orderNumber } = parseChatId(orderId);
  const order =
    orders.find((item) => String(item.productId) === productId && String(item.orderId) === orderNumber) ??
    orders.find((item) => String(item.orderId) === orderId);

  if (!order) notFound();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={1} sx={{ paddingBottom: 2}}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Support chat for order #{order.orderId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chat with the vendor about your order for {order.productName}.
        </Typography>
      </Stack>
      <Stack direction={'row'}>
        <ProductInfoCard productId={order.productId} />
        <OrderChatPanel
          chatId={orderId}
          currentUserId={user.email}
          initialMetadata={{
            orderId: String(order.orderId),
            productId: order.productId,
            buyerId: order.buyerEmail,
            vendorId: order.vendorEmail,
          }}
          title={`Order #${order.orderId}`}
        />
      </Stack>
    </Container>
  );
}
