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
  serverTimestamp,
  updateDoc,
  where,
  startAfter,
  limit,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import { GetPublishedProductsParams, ProductData, ProductEdit, ProductInput } from '@/features/product/product.types';

export type ProductStatus = 'draft' | 'published';

const productsCollection = collection(db, 'products');

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  return typeof value?.toDate === 'function' ? value.toDate() : null;
};

const productFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): ProductData => {
  const data = snapshot.data();
  const imageUrls = Array.isArray(data.imageUrls)
    ? data.imageUrls.filter((value) => typeof value === 'string' && value.length > 0)
    : data.imageUrl
      ? [data.imageUrl]
      : [];

  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: Number(data.price || 0),
    stock: Number(data.stock || 0),
    category: data.category,
    imageUrls,
    status: data.status,
    vendorEmail: data.vendorEmail,
    vendorName: data.vendorName,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
};

export const createProduct = async (product: ProductInput) => {
  const docRef = await addDoc(productsCollection, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateProduct = async (productId: string, product: ProductEdit) => {
  await updateDoc(doc(db, 'products', productId), {
    ...product,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId: string) => {
  await deleteDoc(doc(db, 'products', productId));
};

export const getVendorProducts = async (vendorEmail: string): Promise<ProductData[]> => {
  const q = query(productsCollection, where('vendorEmail', '==', vendorEmail), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(productFromDoc);
};

export const getAllProducts = async (): Promise<ProductData[]> => {
  const snapshot = await getDocs(query(productsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map(productFromDoc);
};

export const getPublishedProducts = async ({
  limit: pageSize = 12,
  search,
  lastDocId,
  category,
  sortBy,
}: GetPublishedProductsParams): Promise<{ data: ProductData[]; lastDocId: string | null }> => {
  const constraints: QueryConstraint[] = [where('status', '==', 'published')];

  if (category) {
    constraints.push(where('category', '==', category));
  }

  if (search) {
    const searchLower = search.toLowerCase();
    constraints.push(where('name_lowercase', '>=', searchLower));
    constraints.push(where('name_lowercase', '<=', searchLower + '\uf8ff'));
    constraints.push(orderBy('name_lowercase', 'asc'));
    console.log(constraints);
  }

  if (!search && sortBy && sortBy.field) {
    constraints.push(orderBy(sortBy.field, sortBy.order));
  } else if (!search) {
    constraints.push(orderBy('createdAt', 'desc'));
  }

  if (lastDocId) {
    const docRef = doc(productsCollection, lastDocId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      constraints.push(startAfter(docSnapshot));
    }
  }
  constraints.push(limit(pageSize));

  const q = query(productsCollection, ...constraints);
  const snapshot = await getDocs(q);

  const data = snapshot.docs.map(productFromDoc);
  const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

  return {
    data,
    lastDocId: lastVisibleDoc ? lastVisibleDoc.id : null,
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
