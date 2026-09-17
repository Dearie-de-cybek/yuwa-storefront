import { NextResponse } from 'next/server';
import * as communityService from '@/server/services/communityService';
import { requireAdmin } from '@/server/auth';

// GET /api/community?all=1 — public list, or admin full list with ?all=1
export async function GET(request) {
  const wantsAll = new URL(request.url).searchParams.get('all') === '1';

  if (wantsAll) {
    const { error } = await requireAdmin(request);
    if (error) return error;
    const posts = await communityService.listAll();
    return NextResponse.json({ posts });
  }

  const posts = await communityService.list();
  return NextResponse.json({ posts });
}

// POST /api/community — admin: add a real customer photo
export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const result = await communityService.create(body);

  if (result.error === 'missing_fields') return NextResponse.json({ message: 'Image and city are required' }, { status: 400 });

  return NextResponse.json(result.post, { status: 201 });
}
