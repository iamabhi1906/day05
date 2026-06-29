import { redirect } from 'next/navigation';
import OrdersPage from '../../orders/orders-page';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/crud/user';
import { getVendorOrders } from '@/lib/crud/order';

export default async function Page() {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');

  const user = await getUserByEmail(email);
  if (!user) redirect('/login');
  if (user.role !== 'vendor') redirect('/products');

  const orders = await getVendorOrders(email);

  return <OrdersPage orders={orders} showBuyerEmail title="Vendor Orders" />;
}