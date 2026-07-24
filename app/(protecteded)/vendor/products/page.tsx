import { redirect } from 'next/navigation';
import VendorProducts from './vendor-products';
import { getVendorProducts } from '@/lib/crud/product';
import { serverApi } from '@/lib/api/server.api';

export default async function Page() {
  const api = await serverApi();
  const { data: user } = await api.get('/auth/me');
  if (!user) redirect('/login');
  if (user.role !== 'vendor') redirect('/products');

  const products = await getVendorProducts();

  return <VendorProducts initialProducts={products} />;
}
