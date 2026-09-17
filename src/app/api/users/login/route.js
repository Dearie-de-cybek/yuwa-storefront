import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';

// POST /api/users/login
export async function POST(request) {
  const { email, password } = await request.json().catch(() => ({}));
  const result = await userService.login(email, password);

  if (result.error === 'missing_fields') return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
  if (result.error === 'invalid_credentials') return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  if (result.error === 'account_disabled') return NextResponse.json({ message: 'Account is disabled' }, { status: 403 });

  return NextResponse.json(result.user);
}
