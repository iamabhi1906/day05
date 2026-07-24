import { revalidatePath } from 'next/cache';
import { serverApi } from '@/lib/api/server.api';

export async function deleteProductAction(formData: FormData) {
  'use server';
  const productId = formData.get('productId')?.toString();
  if (!productId) return;
  const api = await serverApi();
  api.delete(`/admin/products/${productId}`);
  revalidatePath('/admin');
}

export async function toggleUserBlockAction(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  const api = await serverApi();
  await api.patch(`/admin/users/${id}/block-toggle`);
  revalidatePath('/admin');
}

export async function deleteUserAction(formData: FormData) {
  'use server';
  const api = await serverApi();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await api.delete(`/admin/users/${id}`);
  revalidatePath('/admin');
}
