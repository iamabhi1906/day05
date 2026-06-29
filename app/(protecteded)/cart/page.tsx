import { redirect } from 'next/navigation';
import CartPage from './cart-page';
import { getSession } from '@/lib/auth';
import { getCartItems } from '@/lib/crud/cart';
import { getUserByEmail } from '@/lib/crud/user';

export default async function Page() {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');

  const user = await getUserByEmail(email);
  if (!user) redirect('/login');

  const cartItems = await getCartItems(email);

  return <CartPage initialItems={cartItems} user={user} />;
}
