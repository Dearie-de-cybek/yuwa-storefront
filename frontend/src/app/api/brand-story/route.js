import { NextResponse } from 'next/server';
import * as brandStoryService from '@/server/services/brandStoryService';
import { requireAdmin } from '@/server/auth';

// GET /api/brand-story — public
export async function GET() {
  const story = await brandStoryService.get();
  return NextResponse.json(story);
}

// PUT /api/brand-story — admin
export async function PUT(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const story = await brandStoryService.update(body);
  return NextResponse.json(story);
}
