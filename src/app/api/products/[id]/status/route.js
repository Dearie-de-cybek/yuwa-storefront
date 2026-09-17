import { NextResponse } from 'next/server';
import * as productService from '@/server/services/productService';
import { requireAdmin } from '@/server/auth';

// PATCH /api/products/:id/status — admin
export async function PATCH(request, { params }) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await productService.changeStatus(id, body.status, user.id);

  if (result.error === 'not_found') return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  if (result.error === 'invalid_status') return NextResponse.json({ message: `Status must be one of: ${result.validStatuses.join(', ')}` }, { status: 400 });
  if (result.error === 'no_variants') return NextResponse.json({ message: 'Cannot publish: product has no active variants' }, { status: 400 });
  if (result.error === 'no_media') return NextResponse.json({ message: 'Cannot publish: product has no images' }, { status: 400 });

  return NextResponse.json({ message: `Product status updated to ${result.status}` });
}
