import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';
import { requireUser } from '@/server/auth';

// GET /api/users/profile
export async function GET(request) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const profile = await userService.getProfile(user.id);
  if (!profile) return NextResponse.json({ message: 'User not found' }, { status: 404 });
  return NextResponse.json(profile);
}

// PUT /api/users/profile
export async function PUT(request) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const result = await userService.updateProfile(user.id, body);

  if (result.error === 'not_found') return NextResponse.json({ message: 'User not found' }, { status: 404 });
  if (result.error === 'current_password_required') return NextResponse.json({ message: 'Current password is required to set a new password' }, { status: 400 });
  if (result.error === 'current_password_wrong') return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });

  return NextResponse.json(result.user);
}
