import { NextResponse } from 'next/server';
import * as cartService from '@/server/services/cartService';
import { requireUser } from '@/server/auth';

// POST /api/cart/items
export async function POST(request) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const { variantId, quantity } = await request.json().catch(() => ({}));
  if (!variantId) return NextResponse.json({ message: 'Variant ID is required' }, { status: 400 });

  const result = await cartService.addItem(user.id, variantId, quantity || 1);

  if (result.error === 'variant_not_found') return NextResponse.json({ message: 'Variant not found' }, { status: 404 });
  if (result.error === 'variant_inactive') return NextResponse.json({ message: 'This variant is no longer available' }, { status: 400 });
  if (result.error === 'insufficient_stock') return NextResponse.json({ message: `Only ${result.available} left in stock` }, { status: 400 });

  return NextResponse.json(result.cart);
}
