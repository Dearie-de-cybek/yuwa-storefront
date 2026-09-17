import { NextResponse } from 'next/server';
import * as promotionService from '@/server/services/promotionService';
import { requireAdmin } from '@/server/auth';

// PATCH /api/promotions/:id — admin: toggle active
export async function PATCH(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const result = await promotionService.toggle(id);
  if (result.error === 'not_found') return NextResponse.json({ message: 'Promotion not found' }, { status: 404 });
  return NextResponse.json(result.promo);
}

// DELETE /api/promotions/:id — admin
export async function DELETE(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const result = await promotionService.remove(id);
  if (result.error === 'not_found') return NextResponse.json({ message: 'Promotion not found' }, { status: 404 });
  return NextResponse.json({ message: 'Promotion deleted' });
}
