'use server';

import { productFromApi } from '@/lib/api/commerce';
import { serverApi } from '@/lib/api/server.api';
import { GetPublishedProductsParams, ProductData, ProductEdit, ProductInput, ProductStatus } from '@/features/product/product.types';

export type { ProductStatus } from '@/features/product/product.types';

type ApiProduct = Record<string, unknown>;

export const createProduct = async (product: ProductInput): Promise<ProductData> => {
  const api = await serverApi();
  const { data } = await api.post('/products', product);
  return productFromApi(data as ApiProduct);
};

export const updateProduct = async (productId: string, product: ProductEdit): Promise<ProductData> => {
  const api = await serverApi();
  const { data } = await api.put(`/products/${productId}`, product);
  return productFromApi(data as ApiProduct);
};

export const deleteProduct = async (productId: string) => {
  const api = await serverApi();
  await api.delete(`/products/${productId}`);
};

export const getVendorProducts = async (): Promise<ProductData[]> => {
  const api = await serverApi();
  const { data } = await api.get('/products/me');
  return (data as ApiProduct[]).map(productFromApi);
};

export const changeProductStatus = async (productId: string, status: ProductStatus): Promise<ProductData> => {
  const api = await serverApi();
  const { data } = await api.patch(`/products/${productId}/status`, { status });
  return productFromApi(data as ApiProduct);
};

export const getAllProducts = async (): Promise<ProductData[]> => {
  const api = await serverApi();
  const { data } = await api.get('/admin/products');
  return (data as ApiProduct[]).map(productFromApi);
};

export const getPublishedProducts = async (_params: GetPublishedProductsParams) => {
  const api = await serverApi();
  const { data } = await api.get('/products');
  return { data: (data as ApiProduct[]).map(productFromApi), lastDocId: null };
};

export const getProduct = async (productId: string): Promise<ProductData | null> => {
  const api = await serverApi();
  const { data, status } = await api.get(`/products/${productId}`);
  return status === 200 && data ? productFromApi(data as ApiProduct) : null;
};
