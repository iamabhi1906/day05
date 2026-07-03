'use server';

import { z } from 'zod';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { promoSchema, PromoCodeDiscountType } from '@/features/promo/promo.types';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export type PromoData = z.infer<typeof promoSchema> & {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
};

const promoCollection = collection(db, 'promoCodes');

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  if (value && typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
};

const promoFromDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): PromoData => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    code: String(data.code || '').toUpperCase(),
    discount_type: data.discount_type as PromoCodeDiscountType,
    discount_value: Number(data.discount_value || 0),
    max_uses: Number(data.max_uses || 0),
    expires_at: toDate(data.expires_at) ?? new Date(0),
    used_times: Number(data.used_times || 0),
    is_active: Boolean(data.is_active ?? true),
    createdAt: toDate(data.createdAt)?.toISOString() ?? null,
    updatedAt: toDate(data.updatedAt)?.toISOString() ?? null,
  };
};

export const getPromoByCode = async (code: string): Promise<PromoData | null> => {
  const formattedCode = code.trim().toUpperCase();
  if (!formattedCode) return null;

  const q = query(promoCollection, where('code', '==', formattedCode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return promoFromDoc(snapshot.docs[0]);
};

export const validatePromoCode = async (code: string): Promise<PromoData> => {
  const promo = await getPromoByCode(code);
  if (!promo) {
    throw new Error('Promo code not found');
  }

  if (!promo.is_active) {
    throw new Error('Promo code is inactive');
  }

  if (promo.used_times >= promo.max_uses) {
    throw new Error('Promo code has already reached its maximum number of uses');
  }

  if (promo.expires_at < new Date()) {
    throw new Error('Promo code has expired');
  }

  return promo;
};

export const calculatePromoDiscount = async (subTotal: number, promo: PromoData): Promise<number> => {
  if (subTotal <= 0) return 0;
  if (promo.discount_type === PromoCodeDiscountType.PERCENTAGE) {
    return Math.min((subTotal * promo.discount_value) / 100, subTotal);
  }
  return Math.min(promo.discount_value, subTotal);
};
export const applyPromoCode = async (code: string, subTotal: number) => {
  if (!subTotal) {
    throw new Error('Cart subtotal must be greater than zero to apply a promo code');
  }

  const promo = await validatePromoCode(code);
  const discount = await calculatePromoDiscount(subTotal, promo);
  return { promo, discount, total: Math.max(subTotal - discount, 0) };
};

export const redeemPromoCode = async (code: string): Promise<void> => {
  const promo = await validatePromoCode(code);
  const promoRef = doc(db, 'promoCodes', promo.id);
  const nextUses = promo.used_times + 1;
  await updateDoc(promoRef, {
    used_times: nextUses,
    is_active: nextUses < promo.max_uses,
    updatedAt: serverTimestamp(),
  });
};

export const createPromoCode = async (promoInput: Omit<PromoData, 'id' | 'createdAt' | 'updatedAt'>) => {
  const promoPayload = {
    ...promoInput,
    code: promoInput.code.trim().toUpperCase(),
    used_times: promoInput.used_times ?? 0,
    is_active: promoInput.is_active ?? true,
  };

  promoSchema.parse(promoPayload);

  await addDoc(promoCollection, {
    ...promoPayload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};
