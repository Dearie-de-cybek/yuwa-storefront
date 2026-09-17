import { NextResponse } from 'next/server';
import * as orderService from '@/server/services/orderService';
import { requireUser, queryParams } from '@/server/auth';

// GET /api/orders/my-orders
export async function GET(request) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const result = await orderService.findByUser(user.id, queryParams(request));
  return NextResponse.json(result);
}
