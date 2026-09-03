import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';
import { requireAdmin, queryParams } from '@/server/auth';

// GET /api/users/admin/all
export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const result = await userService.findAll(queryParams(request));
  return NextResponse.json(result);
}
