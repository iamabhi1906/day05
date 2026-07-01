import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCartItems, getProductCartItem } from '@/services/cart/get.cart';
import { CartData } from './cart.types';
import { ProductData } from '../product/product.types';
import { addProductToCart } from '@/services/cart/add.cart';
import { removeCartItem, updateCartItemQuantity } from '@/lib/crud/cart';
import { clearUserCartItems } from '@/services/cart/remove.cart';

interface CartUser {
  buyerEmail: string | null;
}

interface GetProductCartItem extends CartUser {
  productId: string;
}

interface AddCartPayload extends CartUser {
  product: ProductData;
}

interface RemoveCartPayload extends CartUser {
  cartId: string;
}

interface UpdateCartQuantityPayload extends CartUser {
  cartId: string;
  quantity: number;
}

export const getUserCartItemsAsync = createAsyncThunk<CartData[], CartUser, { rejectValue: string }>(
  'get/carts',
  async ({ buyerEmail }, { rejectWithValue }) => {
    try {
      if (!buyerEmail) {
        const rawData = localStorage.getItem('cart');
        if (!rawData) {
          return [];
        }
        return JSON.parse(rawData) as CartData[];
      }
      const rawData = localStorage.getItem('cart');
      if (rawData) {
        const unProcessedCartProducts = JSON.parse(rawData) as CartData[];
        for (const unProcessedCartProduct of unProcessedCartProducts) {
          await addProductToCart(buyerEmail, {
            id: unProcessedCartProduct.productId,
            name: unProcessedCartProduct.productName,
            price: unProcessedCartProduct.price,
            imageUrl: unProcessedCartProduct.productImageUrl,
            vendorEmail: unProcessedCartProduct.vendorEmail,
          } as ProductData);
        }
        localStorage.removeItem('cart');
      }
      return await getCartItems(buyerEmail);
    } catch {
      return rejectWithValue('Failed to get user cart');
    }
  },
);

export const getUserProductCartItemAsync = createAsyncThunk<CartData, GetProductCartItem, { rejectValue: string }>(
  'get/product/cart',
  async ({ buyerEmail, productId }, { rejectWithValue }) => {
    try {
      if (!buyerEmail) {
        const rawData = localStorage.getItem('cart');
        if (!rawData) {
          return rejectWithValue('Cart item not found');
        }
        const userCartItems = JSON.parse(rawData) as CartData[];
        const cartItem = userCartItems.find((userCartItem) => userCartItem.productId == productId);
        if (!cartItem) {
          return rejectWithValue('Cart item not found');
        }
        return cartItem;
      }
      const cartItem = await getProductCartItem(buyerEmail, productId);
      if (!cartItem) {
        return rejectWithValue('Cart item not found');
      }
      return cartItem;
    } catch {
      return rejectWithValue('Failed to get user cart');
    }
  },
);

export const addUserCartItemAsync = createAsyncThunk<CartData[], AddCartPayload, { rejectValue: string }>(
  'cart/add',
  async ({ buyerEmail, product }, { rejectWithValue }) => {
    try {
      if (!buyerEmail) {
        const rawData = localStorage.getItem('cart');
        const cart: CartData[] = rawData ? JSON.parse(rawData) : [];
        const existingItem = cart.find((item) => item.productId === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: product.id,
            buyerEmail: null,
            productId: product.id,
            productName: product.name,
            productImageUrl: product.imageUrl,
            vendorEmail: product.vendorEmail,
            price: product.price,
            quantity: 1,
            addedAt: new Date().toISOString(),
          });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
      }
      await addProductToCart(buyerEmail, product);
      return await getCartItems(buyerEmail);
    } catch {
      return rejectWithValue('Failed to add cart item.');
    }
  },
);

export const updateUserCartItemQuantityAsync = createAsyncThunk<CartData[], UpdateCartQuantityPayload, { rejectValue: string }>(
  'cart/update-quantity',
  async ({ buyerEmail, cartId, quantity }, { rejectWithValue }) => {
    try {
      if (!buyerEmail) {
        const rawData = localStorage.getItem('cart');
        const cart: CartData[] = rawData ? JSON.parse(rawData) : [];
        const updated = cart
          .map((item) => (item.id === cartId ? { ...item, quantity: Math.max(0, quantity) } : item))
          .filter((item) => item.quantity > 0);
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      }
      if (quantity <= 0) {
        await removeCartItem(cartId);
        return await getCartItems(buyerEmail);
      }
      await updateCartItemQuantity(cartId, quantity);
      return await getCartItems(buyerEmail);
    } catch {
      return rejectWithValue('Failed to update cart quantity.');
    }
  },
);

export const removeUserCartItemAsync = createAsyncThunk<CartData[], RemoveCartPayload, { rejectValue: string }>(
  'cart/remove',
  async ({ buyerEmail, cartId }, { rejectWithValue }) => {
    try {
      if (!buyerEmail) {
        const rawData = localStorage.getItem('cart');
        const cart: CartData[] = rawData ? JSON.parse(rawData) : [];
        const updated = cart.filter((item) => item.id !== cartId);
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      }
      await removeCartItem(cartId);
      return await getCartItems(buyerEmail);
    } catch {
      return rejectWithValue('Failed to remove cart item.');
    }
  },
);

export const clearUserCartAsync = createAsyncThunk<CartData[], CartUser, { rejectValue: string }>(
  'cart/clear',
  async ({ buyerEmail }, { rejectWithValue }) => {
    try {
      if (!buyerEmail) {
        localStorage.removeItem('cart');
        return [];
      }
      await clearUserCartItems(buyerEmail);
      return [];
    } catch {
      return rejectWithValue('Failed to clear cart.');
    }
  },
);
