import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';
import { requireAdmin } from '@/server/auth';

// GET /api/users/admin/:id
export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const user = await userService.findById(id);
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}
