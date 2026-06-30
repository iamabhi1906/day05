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
} from 'firebase/firestore';
import { db } from '../firebase';

export type ProductStatus = 'draft' | 'published';

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  imageUrls: string[];
  imagePublicId: string;
  imagePublicIds: string[];
  status: ProductStatus;
  vendorEmail: string;
  vendorName: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type ProductInput = Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>;

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
  const imagePublicIds = Array.isArray(data.imagePublicIds)
    ? data.imagePublicIds.filter((value) => typeof value === 'string' && value.length > 0)
    : data.imagePublicId
      ? [data.imagePublicId]
      : [];

  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: Number(data.price || 0),
    stock: Number(data.stock || 0),
    category: data.category,
    imageUrl: imageUrls[0] || data.imageUrl || '',
    imageUrls,
    imagePublicId: imagePublicIds[0] || data.imagePublicId || '',
    imagePublicIds,
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

export const updateProduct = async (productId: string, product: Partial<ProductInput>) => {
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

export const getPublishedProducts = async ({
  limit: pageSize = 10,
  search,
  lastDocId,
}: {
  limit?: number;
  search?: string;
  lastDocId?: string | null;
}): Promise<{ data: ProductData[]; lastDocId: string | null }> => {
  let q = query(productsCollection, where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(pageSize));
  if (lastDocId) {
    const docRef = doc(productsCollection, lastDocId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {q = query(q, startAfter(docSnapshot));}
  }
  const snapshot = await getDocs(q);
  let data = snapshot.docs.map(productFromDoc);
  if (search) {
    const s = search.toLowerCase();
    data = data.filter((p) => p.name.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s));
  }
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
