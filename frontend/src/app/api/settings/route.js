import { NextResponse } from 'next/server';
import * as settingService from '@/server/services/settingService';
import { requireAdmin } from '@/server/auth';

// GET /api/settings — admin
export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const settings = await settingService.get();
  return NextResponse.json(settings);
}

// PUT /api/settings — admin
export async function PUT(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const settings = await settingService.update(body);
  return NextResponse.json(settings);
}
