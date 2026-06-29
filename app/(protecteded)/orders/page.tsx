import { redirect } from 'next/navigation';
import OrdersPage from './orders-page';
import { getSession } from '@/lib/auth';
import { getBuyerOrders } from '@/lib/crud/order';
import { getUserByEmail } from '@/lib/crud/user';

export default async function Page() {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');

  const user = await getUserByEmail(email);
  if (!user) redirect('/login');

  const orders = await getBuyerOrders(email);

  return <OrdersPage orders={orders} />;
}
