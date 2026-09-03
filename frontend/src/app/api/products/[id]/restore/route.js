import { NextResponse } from 'next/server';
import * as productService from '@/server/services/productService';
import { requireAdmin } from '@/server/auth';

// PATCH /api/products/:id/restore — admin
export async function PATCH(request, { params }) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const result = await productService.restore(id, user.id);

  if (result.error === 'not_found') return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  if (result.error === 'not_deleted') return NextResponse.json({ message: 'Product is not deleted' }, { status: 400 });

  return NextResponse.json({ message: 'Product restored to drafts' });
}
