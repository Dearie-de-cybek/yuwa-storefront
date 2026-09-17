import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';
import { requireUser } from '@/server/auth';

// PUT /api/users/addresses/:id
export async function PUT(request, { params }) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await userService.updateAddress(user.id, id, body);

  if (result.error === 'not_found') return NextResponse.json({ message: 'Address not found' }, { status: 404 });
  return NextResponse.json(result.address);
}

// DELETE /api/users/addresses/:id
export async function DELETE(request, { params }) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const { id } = await params;
  const result = await userService.deleteAddress(user.id, id);

  if (result.error === 'not_found') return NextResponse.json({ message: 'Address not found' }, { status: 404 });
  return NextResponse.json({ message: 'Address removed' });
}
