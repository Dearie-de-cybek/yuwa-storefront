import { NextResponse } from 'next/server';
import * as waitlistService from '@/server/services/waitlistService';

// POST /api/waitlist — public: join the waitlist for a not-yet-launched occasion.
export async function POST(request) {
  const { email, occasion } = await request.json().catch(() => ({}));
  const result = await waitlistService.join(email, occasion);

  if (result.error === 'invalid_email') return NextResponse.json({ message: 'Enter a valid email address' }, { status: 400 });
  if (result.error === 'invalid_occasion') return NextResponse.json({ message: 'Invalid occasion' }, { status: 400 });

  return NextResponse.json({ message: "You're on the list" }, { status: 201 });
}
