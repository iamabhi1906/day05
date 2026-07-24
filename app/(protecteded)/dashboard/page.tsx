import { redirect } from 'next/navigation';
import { serverApi } from '@/lib/api/server.api';

export default async function Page() {
  const api = await serverApi();
  const { data: user } = await api.get('/auth/me');
  if (!user) redirect('/login');
  if (user.role === 'vendor') redirect('/vendor/products');
  if (user.role === 'admin') redirect('/admin');
  redirect('/products');
}
