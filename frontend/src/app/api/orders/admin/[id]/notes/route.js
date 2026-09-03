import { NextResponse } from 'next/server';
import * as orderService from '@/server/services/orderService';
import { requireAdmin } from '@/server/auth';

// POST /api/orders/admin/:id/notes
export async function POST(request, { params }) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await orderService.addNote(id, body.content, user.id);

  if (result.error === 'not_found') return NextResponse.json({ message: 'Order not found' }, { status: 404 });

  return NextResponse.json(result.note, { status: 201 });
}
