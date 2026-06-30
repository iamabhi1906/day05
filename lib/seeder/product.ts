import {
  collection,
  writeBatch,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ProductInput } from '../crud/product';

const productsCollection = collection(db, 'products');

type DummyProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: any[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
  };
  images: string[];
  thumbnail: string;
};

const fetchDummyProducts = async (limit = 150): Promise<DummyProduct[]> => {
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=15`);
  const data = await res.json();
  return data.products;
};

const mapToProductInput = (p: DummyProduct): ProductInput => {
  const imageUrls = p.images?.length ? p.images : [p.thumbnail];

  return {
    name: p.title,
    description: p.description,
    price: Number(p.price),
    stock: Number(p.stock),
    category: p.category,
    imageUrl: imageUrls[0],
    imageUrls,
    imagePublicId: `dummyjson_${p.id}_main`,
    imagePublicIds: imageUrls.map((_, i) => `dummyjson_${p.id}_${i}`),
    status: 'published',
    vendorEmail: 'seed@demo.com',
    vendorName: 'Dummy Vendor',
  };
};

export const seedProducts = async () => {
  const products = await fetchDummyProducts(150);

  const batchSize = 450; // safe under Firestore 500 limit
  let batch = writeBatch(db);
  let opCount = 0;

  for (const product of products) {
    const ref = doc(productsCollection);

    const mapped = mapToProductInput(product);

    batch.set(ref, {
      ...mapped,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    opCount++;

    if (opCount === batchSize) {
      await batch.commit();
      batch = writeBatch(db);
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }

  console.log(`Seeded ${products.length} products successfully`);
};