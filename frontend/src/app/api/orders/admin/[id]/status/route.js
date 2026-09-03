import { NextResponse } from 'next/server';
import * as orderService from '@/server/services/orderService';
import { requireAdmin } from '@/server/auth';

// PUT /api/orders/admin/:id/status
export async function PUT(request, { params }) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const { status, trackingNumber, shippingMethod, note } = await request.json().catch(() => ({}));
  const result = await orderService.updateStatus(id, status, user.id, { trackingNumber, shippingMethod, note });

  if (result.error === 'not_found') return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  if (result.error === 'invalid_status') return NextResponse.json({ message: `Status must be: ${result.validStatuses.join(', ')}` }, { status: 400 });
  if (result.error === 'invalid_transition') return NextResponse.json({ message: result.message }, { status: 400 });

  return NextResponse.json(result.order);
}
