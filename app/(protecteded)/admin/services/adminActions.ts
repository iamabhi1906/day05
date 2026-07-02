import { revalidatePath } from 'next/cache';
import { deleteProduct } from '@/lib/crud/product';
import { deleteUserByEmail, getUserByEmail, updateUserByEmail } from '@/lib/crud/user';

export async function deleteProductAction(formData: FormData) {
  'use server';
  const productId = formData.get('productId')?.toString();
  if (!productId) return;
  await deleteProduct(productId);
  revalidatePath('/admin');
}

export async function toggleUserBlockAction(formData: FormData) {
  'use server';
  const email = formData.get('email')?.toString();
  if (!email) return;
  const user = await getUserByEmail(email);
  if (!user) return;
  await updateUserByEmail(email, { isBlocked: !user.isBlocked });
  revalidatePath('/admin');
}

export async function deleteUserAction(formData: FormData) {
  'use server';
  const email = formData.get('email')?.toString();
  if (!email) return;
  await deleteUserByEmail(email);
  revalidatePath('/admin');
}
