import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';
import { requireAdmin } from '@/server/auth';

// PUT /api/users/admin/:id/role
export async function PUT(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await userService.updateRole(id, body.role);

  if (result.error === 'not_found') return NextResponse.json({ message: 'User not found' }, { status: 404 });
  if (result.error === 'invalid_role') return NextResponse.json({ message: `Role must be one of: ${result.valid.join(', ')}` }, { status: 400 });

  return NextResponse.json({ message: `Role updated to ${result.role}` });
}
