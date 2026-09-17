import { NextResponse } from 'next/server';
import * as cartService from '@/server/services/cartService';
import { requireUser } from '@/server/auth';

// GET /api/cart
export async function GET(request) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const cart = await cartService.getCart(user.id);
  return NextResponse.json(cart);
}

// DELETE /api/cart — clear
export async function DELETE(request) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const result = await cartService.clearCart(user.id);
  return NextResponse.json(result.cart);
}
