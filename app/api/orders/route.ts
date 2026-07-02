import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { placeOrder, getBuyerOrders } from '@/lib/crud/order';
import { CartData } from '@/features/cart/cart.types';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await getBuyerOrders(session.email);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItems } = await req.json();
    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'cartItems array is required' }, { status: 400 });
    }

    await placeOrder(session.email, cartItems as CartData[]);
    return NextResponse.json({ message: 'Order placed successfully' }, { status: 201 });
  } catch (error) {
    console.error('Place order error:', error);
    const message = error instanceof Error ? error.message : 'Failed to place order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
