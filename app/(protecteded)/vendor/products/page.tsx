import { redirect } from 'next/navigation';
import VendorProducts from './vendor-products';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/crud/user';
import { getVendorProducts } from '@/lib/crud/product';

export default async function Page() {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');

  const user = await getUserByEmail(email);
  if (!user) redirect('/login');
  if (user.role !== 'vendor') redirect('/products');

  const products = await getVendorProducts(email);

  return <VendorProducts initialProducts={products} user={user} />;
}
