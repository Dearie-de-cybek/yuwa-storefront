import { NextResponse } from 'next/server';
import * as userService from '@/server/services/userService';

// POST /api/users — register
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const result = await userService.register(body);

  if (result.error === 'missing_fields') return NextResponse.json({ message: 'Please fill in all fields' }, { status: 400 });
  if (result.error === 'user_exists') return NextResponse.json({ message: 'User already exists' }, { status: 400 });

  return NextResponse.json(result.user, { status: 201 });
}
