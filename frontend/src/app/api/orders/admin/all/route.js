import { NextResponse } from 'next/server';
import * as orderService from '@/server/services/orderService';
import { requireAdmin, queryParams } from '@/server/auth';

// GET /api/orders/admin/all
export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const result = await orderService.findAll(queryParams(request));
  return NextResponse.json(result);
}
