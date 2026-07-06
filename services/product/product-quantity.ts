import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductSchema } from '@/features/product/product.types';

export async function decreaseProductStock(productId: string, quantity: number) {
  const productRef = doc(db, 'products', productId);
  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) {
      throw new Error('Product not found');
    }
    const product = ProductSchema.parse(productSnap.data);
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    transaction.update(productRef, {
      stock: product.stock - quantity,
      updatedAt: new Date(),
    });
  });
}
