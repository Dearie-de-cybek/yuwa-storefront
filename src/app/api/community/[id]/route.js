import { NextResponse } from 'next/server';
import * as communityService from '@/server/services/communityService';
import { requireAdmin } from '@/server/auth';

// PATCH /api/community/:id — admin: toggle active
export async function PATCH(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const result = await communityService.toggleActive(id);
  if (result.error === 'not_found') return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  return NextResponse.json(result.post);
}

// DELETE /api/community/:id — admin
export async function DELETE(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const result = await communityService.remove(id);
  if (result.error === 'not_found') return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  return NextResponse.json({ message: 'Post removed' });
}
