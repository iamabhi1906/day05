import { cartQuantityChange } from '@/services/cart/add.cart';
import { removeUserCartItem } from '@/services/cart/remove.cart';

export const updateCartItemQuantity = cartQuantityChange;
export const removeCartItem = removeUserCartItem;
