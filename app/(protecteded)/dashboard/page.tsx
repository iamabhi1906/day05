import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/crud/user';

export default async function Page() {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');

  const user = await getUserByEmail(email);
  if (user?.role === 'vendor') redirect('/vendor/products');
  redirect('/products');
}
