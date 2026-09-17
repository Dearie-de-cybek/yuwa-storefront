import { NextResponse } from 'next/server';
import * as cartService from '@/server/services/cartService';
import { requireUser } from '@/server/auth';

// PUT /api/cart/items/:id
export async function PUT(request, { params }) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await cartService.updateItem(user.id, id, body.quantity);

  if (result.error === 'not_found') return NextResponse.json({ message: 'Cart item not found' }, { status: 404 });
  if (result.error === 'insufficient_stock') return NextResponse.json({ message: `Only ${result.available} left in stock` }, { status: 400 });

  return NextResponse.json(result.cart);
}

// DELETE /api/cart/items/:id
export async function DELETE(request, { params }) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const { id } = await params;
  const result = await cartService.removeItem(user.id, id);

  if (result.error === 'not_found') return NextResponse.json({ message: 'Cart item not found' }, { status: 404 });
  return NextResponse.json(result.cart);
}
