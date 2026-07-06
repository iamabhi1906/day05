import { notFound, redirect } from 'next/navigation';
import { Container, Stack, Typography } from '@mui/material';
import { VendorProtect } from '@/lib/auth';
import OrderChatPanel from '@/components/order-chat-panel';
import { getVendorOrders } from '@/services/orders/vendor-orders';
import { parseChatId } from '@/lib/chat';
import ProductInfoCard from '@/components/product-info-card';

interface VendorChatPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function VendorChatPage({ params }: VendorChatPageProps) {
  const { orderId } = await params;
  try {
    await VendorProtect();
  } catch {
    redirect('/products');
  }

  const orders = await getVendorOrders();
  const { productId, orderId: orderNumber } = parseChatId(orderId);
  const order =
    orders.find((item) => String(item.productId) === productId && String(item.orderId) === orderNumber) ??
    orders.find((item) => String(item.orderId) === orderId);

  if (!order) notFound();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack sx={{ paddingBottom: 2}}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Support chat for order #{order.orderId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reply to the buyer about order {order.productName}.
        </Typography>
      </Stack>
      <Stack direction={'row'}>
        <ProductInfoCard productId={order.productId} />
        <OrderChatPanel
          chatId={orderId}
          currentUserId={order.vendorEmail}
          initialMetadata={{
            orderId: String(order.orderId),
            productId: order.productId,
            buyerId: order.buyerEmail,
            vendorId: order.vendorEmail,
          }}
          title={`Conversation for order #${order.orderId}`}
        />
      </Stack>
    </Container>
  );
}
