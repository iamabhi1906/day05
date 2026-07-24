'use server';
import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
  startAfter,
  limit,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import { GetPublishedProductsParams, ProductData, ProductEdit, ProductInput, ProductStatus } from '@/features/product/product.types';
import { Protect } from '../auth';
import { serverApi } from '../api/server.api';

const productsCollection = collection(db, 'products');

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  return typeof value?.toDate === 'function' ? value.toDate() : null;
};

const productFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): ProductData => {
  const data = snapshot.data();
  const productImages = Array.isArray(data.productImages)
    ? data.productImages.filter((value) => typeof value === 'string' && value.length > 0)
    : data.imageUrl
      ? [data.imageUrl]
      : [];

  return {
    id: snapshot.id,
    title: data.name,
    description: data.description,
    price: Number(data.price || 0),
    stock: Number(data.stock || 0),
    category: data.category,
    productImages: productImages,
    status: data.status,
    userId: data.userId,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
};

export const createProduct = async (product: ProductInput): Promise<ProductData> => {
  const api = await serverApi();
  const { data } = await api.post('/products', product);
  return data as ProductData;
};

export const updateProduct = async (productId: string, product: ProductEdit) => {
  const api = await serverApi();
  const { data } = await api.put(`/products/${productId}`, product);
  return data as ProductData;
};

export const deleteProduct = async (productId: string) => {
  const api = await serverApi();
  await api.delete(`/products/${productId}`);
};

export const getVendorProducts = async (): Promise<ProductData[]> => {
  const api = await serverApi();
  const { data } = await api.get('/products/me');
  return data as ProductData[];
};

export const changeProductStatus = async (productId: string, newStatus: ProductStatus): Promise<ProductData> => {
  const api = await serverApi();
  const { data } = await api.patch(`/products/${productId}/status`, { status: newStatus });
  return data as ProductData;
};

export const getAllProducts = async (): Promise<ProductData[]> => {
  const api = await serverApi();
  const { data } = await api.get('/admin/products');
  return data as ProductData[];
};

export const getPublishedProducts = async ({
  limit: pageSize = 60,
  search,
  lastDocId,
  category,
  sortBy,
}: GetPublishedProductsParams): Promise<{ data: ProductData[]; lastDocId: string | null }> => {
  const api = await serverApi();
  const { data } = await api.get('/products');

  return {
    data,
    lastDocId: null,
  };
};

export const getProduct = async (productId: string): Promise<ProductData | null> => {
  try {
    const docRef = doc(db, 'products', productId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return productFromDoc(snapshot as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};
