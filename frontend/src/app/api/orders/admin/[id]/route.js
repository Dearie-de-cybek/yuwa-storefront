import { NextResponse } from 'next/server';
import * as orderService from '@/server/services/orderService';
import { requireAdmin } from '@/server/auth';

// GET /api/orders/admin/:id
export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const order = await orderService.findById(id);
  if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  return NextResponse.json(order);
}
