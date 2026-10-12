'use server';
import { serverApi } from '@/lib/api/server.api';
import { ProductEdit, ProductInput, ProductStatus } from '@/features/product/product.types';

export type { ProductStatus } from '@/features/product/product.types';

export type ApiProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  productImages: string[];
  user: {
    name: string;
    email: string;
  };
};

export const createProduct = async (product: ProductInput): Promise<ApiProduct> => {
  const api = await serverApi();
  const { data } = await api.post('/products', product);
  return data as ApiProduct;
};

export const updateProduct = async (productId: string, product: ProductEdit): Promise<ApiProduct> => {
  const api = await serverApi();
  const { data } = await api.put(`/products/${productId}`, product);
  return data as ApiProduct;
};

export const deleteProduct = async (productId: string) => {
  const api = await serverApi();
  await api.delete(`/products/${productId}`);
};

export const getVendorProducts = async (): Promise<ApiProduct[]> => {
  const api = await serverApi();
  const { data } = await api.get('/products/me');
  return data as ApiProduct[];
};

export const changeProductStatus = async (productId: string, status: ProductStatus): Promise<ApiProduct> => {
  const api = await serverApi();
  const { data } = await api.patch(`/products/${productId}/status`, { status });
  return data as ApiProduct;
};

export const getAllProducts = async (): Promise<ApiProduct[]> => {
  const api = await serverApi();
  const { data } = await api.get('/admin/products');
  return data as ApiProduct[];
};

export const getPublishedProducts = async () => {
  const api = await serverApi();
  const { data } = await api.get('/products');
  return { data: data as ApiProduct[], lastDocId: null };
};

export const getProduct = async (productId: string): Promise<ApiProduct | null> => {
  const api = await serverApi();
  const { data, status } = await api.get(`/products/${productId}`);
  return status === 200 && data ? (data as ApiProduct) : null;
};
