import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';
import { requireUser } from '@/server/auth';

// POST /api/users/addresses
export async function POST(request) {
  const { user, error } = await requireUser(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const result = await userService.addAddress(user.id, body);

  if (result.error === 'missing_fields') return NextResponse.json({ message: 'Please fill in all required address fields' }, { status: 400 });

  return NextResponse.json(result.address, { status: 201 });
}
