import { NextResponse } from 'next/server';
import * as productService from '@/server/services/productService';
import { requireAdmin, queryParams } from '@/server/auth';

// GET /api/products — public, paginated/filterable
export async function GET(request) {
  const result = await productService.findAll(queryParams(request));
  return NextResponse.json(result);
}

// POST /api/products — admin: create a blank draft
export async function POST(request) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const product = await productService.createDraft(user.id);
  return NextResponse.json(product, { status: 201 });
}
