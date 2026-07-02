/**
 * Protected CRUD operations - These functions check authentication before executing
 * Use these instead of calling CRUD functions directly from pages/components
 */

import { getSession } from './auth';
import {
  getCartItems as getCrudCartItems,
  addProductToCart as addCrudProductToCart,
  updateCartItemQuantity as updateCrudCartQuantity,
  removeCartItem as removeCrudCartItem,
  clearCart as clearCrudCart,
} from './crud/cart';
import {
  getBuyerOrders as getCrudBuyerOrders,
  placeOrder as placeCrudOrder,
} from './crud/order';
import {
  getUserByEmail as getCrudUserByEmail,
} from './crud/user';
import { ProductData } from '@/features/product/product.types';
import { CartItemData } from './crud/cart';
import { CartData } from '@/features/cart/cart.types';
import { OrderData } from './crud/order';
import { UserData } from './crud/user';

// ============ CART OPERATIONS ============

export async function getCartItems(buyerEmail: string): Promise<CartItemData[]> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: Please login to view cart');
  }
  return getCrudCartItems(buyerEmail);
}

export async function addProductToCart(buyerEmail: string, product: ProductData): Promise<void> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: Please login to add items to cart');
  }
  return addCrudProductToCart(buyerEmail, product);
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<void> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: Please login to update cart');
  }
  return updateCrudCartQuantity(cartItemId, quantity);
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: Please login to remove items');
  }
  return removeCrudCartItem(cartItemId);
}

export async function clearCart(buyerEmail: string): Promise<void> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: Please login');
  }
  return clearCrudCart(buyerEmail);
}

// ============ ORDER OPERATIONS ============

export async function getBuyerOrders(buyerEmail: string): Promise<OrderData[]> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: Please login to view orders');
  }
  return getCrudBuyerOrders(buyerEmail);
}

export async function placeOrder(buyerEmail: string, cartItems: CartData[]): Promise<void> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: Please login to place order');
  }
  return placeCrudOrder(buyerEmail, cartItems);
}

// ============ USER OPERATIONS ============

export async function getUserByEmail(email: string): Promise<UserData | null> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: Please login to access user data');
  }
  return getCrudUserByEmail(email);
}
