import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getCartItems, addProductToCart, updateCartItemQuantity, removeCartItem } from '@/lib/crud/cart';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await getCartItems(session.email);
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product } = await req.json();
    if (!product) {
      return NextResponse.json({ error: 'Product is required' }, { status: 400 });
    }

    await addProductToCart(session.email, product);
    const cartItems = await getCartItems(session.email);
    return NextResponse.json(cartItems, { status: 201 });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Failed to add product to cart' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartId, quantity } = await req.json();
    if (!cartId || quantity === undefined) {
      return NextResponse.json({ error: 'cartId and quantity are required' }, { status: 400 });
    }

    if (quantity <= 0) {
      await removeCartItem(cartId);
    } else {
      await updateCartItemQuantity(cartId, quantity);
    }

    const cartItems = await getCartItems(session.email);
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartId } = await req.json();
    if (!cartId) {
      return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
    }

    await removeCartItem(cartId);
    const cartItems = await getCartItems(session.email);
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Delete cart error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
