'use server';

import { CartData } from '@/features/cart/cart.types';
import { Protect } from '@/lib/auth';
import { addDoc } from 'firebase/firestore';
import { clearUserCartItems } from '@/services/cart/remove.cart';
import { calculatePromoDiscount, redeemPromoCode, validatePromoCode } from '@/services/promo/promo';
import { ordersCollection } from './collections';
import { OrderData, OrderPaymentStatus, OrderStatus } from '@/features/orders/orders.types';

export async function PlaceAnOrder(cartItems: CartData[], promoCode: string | null) {
  const user = await Protect();
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cart is empty');
  }
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let totalDiscount = 0;
  if (promoCode) {
    const promo = await validatePromoCode(promoCode);
    totalDiscount = await calculatePromoDiscount(subTotal, promo);
  }
  const orderId = Math.floor(100000 + Math.random() * 900000);
  for (const cartItem of cartItems) {
    const itemTotal = cartItem.price * cartItem.quantity;
    const itemDiscount = subTotal > 0 ? Number(((itemTotal / subTotal) * totalDiscount).toFixed(2)) : 0;
    const order: OrderData = {
      buyerEmail: user.email,
      placedAt: new Date(),
      orderId,
      status: OrderStatus.CREATED,
      paymentStatus: OrderPaymentStatus.PAID,
      productId: cartItem.productId,
      productName: cartItem.productName,
      productImageUrls: cartItem.productImageUrls,
      productPrice: cartItem.price,
      vendorEmail: cartItem.vendorEmail,
      quantity: cartItem.quantity,
      discount: itemDiscount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await addDoc(ordersCollection, order);
  }
  if (promoCode) {
    await redeemPromoCode(promoCode);
  }
  await clearUserCartItems(user.email);
}
