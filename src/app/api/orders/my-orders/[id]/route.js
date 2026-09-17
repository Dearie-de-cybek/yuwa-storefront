import { NextResponse } from 'next/server';
import * as orderService from '@/server/services/orderService';
import { requireUser } from '@/server/auth';

// GET /api/orders/my-orders/:id
export async function GET(request, { params }) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const { id } = await params;
  const order = await orderService.findById(id, user.id);
  if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  return NextResponse.json(order);
}
