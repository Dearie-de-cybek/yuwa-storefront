import { NextResponse } from 'next/server';
import * as orderService from '@/server/services/orderService';
import { requireUser } from '@/server/auth';

// POST /api/orders/checkout
export async function POST(request) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const result = await orderService.checkout(user.id, body);

  if (result.error === 'missing_address') return NextResponse.json({ message: 'Shipping address is required' }, { status: 400 });
  if (result.error === 'empty_cart') return NextResponse.json({ message: 'Your cart is empty' }, { status: 400 });
  if (result.error === 'insufficient_stock') return NextResponse.json({ message: 'Some items are out of stock', details: result.details }, { status: 400 });
  if (result.error === 'invalid_promo') return NextResponse.json({ message: result.message }, { status: 400 });

  return NextResponse.json(result.order, { status: 201 });
}
