import { NextResponse } from 'next/server';
import * as promotionService from '@/server/services/promotionService';
import { requireAdmin } from '@/server/auth';

// GET /api/promotions — admin
export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const promos = await promotionService.list();
  return NextResponse.json(promos);
}

// POST /api/promotions — admin
export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const result = await promotionService.create(body);

  if (result.error === 'missing_fields') return NextResponse.json({ message: 'Title, code, type and value are required' }, { status: 400 });
  if (result.error === 'invalid_type') return NextResponse.json({ message: 'Discount type must be PERCENTAGE or FIXED' }, { status: 400 });
  if (result.error === 'code_exists') return NextResponse.json({ message: 'A promotion with this code already exists' }, { status: 400 });

  return NextResponse.json(result.promo, { status: 201 });
}
