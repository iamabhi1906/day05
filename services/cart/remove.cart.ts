import api from '@/lib/api/api';

export const removeUserCartItem = async (cartItemId: string) => { await api.delete(`/cart/${cartItemId}`); };

export const clearUserCartItems = async (_buyerEmail?: string) => { await api.delete('/cart'); };
