import { NextResponse } from 'next/server';
import * as productService from '@/server/services/productService';
import { requireAdmin } from '@/server/auth';

// GET /api/products/:id — public (UUID or slug)
export async function GET(request, { params }) {
  const { id } = await params;
  const product = await productService.findById(id);
  if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  return NextResponse.json(product);
}

// PUT /api/products/:id — admin
export async function PUT(request, { params }) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const product = await productService.update(id, body, user.id);
  if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  return NextResponse.json(product);
}

// DELETE /api/products/:id — admin (soft delete)
export async function DELETE(request, { params }) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const result = await productService.softDelete(id, user.id);
  if (!result) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  return NextResponse.json({ message: 'Product moved to trash' });
}
