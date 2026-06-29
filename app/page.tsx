// import Loading from './loading';
import NavigationBar from '@/components/navigation-bar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/crud/user';

export default async function Home() {
  const session = await getSession();
  const email = await session?.email;
  const user = await getUserByEmail(email!);
  if (!email) redirect('/login');
  if (user) {
    if (user?.role === 'vendor') redirect('/vendor/products');
    else redirect('/products');
  }
  return (
    <div>
      <NavigationBar />
      This is simple page
    </div>
  );
}
