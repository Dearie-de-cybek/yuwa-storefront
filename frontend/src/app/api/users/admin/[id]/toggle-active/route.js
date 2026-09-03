import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';
import { requireAdmin } from '@/server/auth';

// PUT /api/users/admin/:id/toggle-active
export async function PUT(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const result = await userService.toggleActive(id);

  if (result.error === 'not_found') return NextResponse.json({ message: 'User not found' }, { status: 404 });

  return NextResponse.json({
    message: result.isActive ? 'User account enabled' : 'User account disabled',
    isActive: result.isActive,
  });
}
