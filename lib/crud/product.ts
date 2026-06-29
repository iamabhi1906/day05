import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  doc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  where,
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
  imagePublicId: string;
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
  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: Number(data.price || 0),
    stock: Number(data.stock || 0),
    category: data.category,
    imageUrl: data.imageUrl,
    imagePublicId: data.imagePublicId,
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

export const getPublishedProducts = async (): Promise<ProductData[]> => {
  const q = query(productsCollection, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(productFromDoc);
};
