import { NextResponse } from 'next/server';
import * as reviewService from '@/server/services/reviewService';
import { requireUser } from '@/server/auth';

// GET /api/products/:id/reviews — public
export async function GET(request, { params }) {
  const { id } = await params;
  const result = await reviewService.listByProduct(id);
  return NextResponse.json(result);
}

// POST /api/products/:id/reviews — auth required
export async function POST(request, { params }) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await reviewService.create(user.id, id, body);

  if (result.error === 'invalid_rating') return NextResponse.json({ message: 'Please choose a rating between 1 and 5' }, { status: 400 });
  if (result.error === 'product_not_found') return NextResponse.json({ message: 'Product not found' }, { status: 404 });

  return NextResponse.json(result.review, { status: 201 });
}
