import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getProduct } from '@/lib/crud/product';
import { getUserByEmail } from '@/lib/crud/user';
import { getCartItems } from '@/lib/crud/cart';
import ProductDetailPage from './product-detail-client';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');
  const user = await getUserByEmail(email);
  if (!user) redirect('/login');
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) redirect('/products');

  const cartItems = await getCartItems(email);
  const cartItem = cartItems.find((item) => item.productId === product.id) || null;

  return <ProductDetailPage product={product} user={user} cartItem={cartItem} />;
}
