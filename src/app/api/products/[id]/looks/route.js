import { NextResponse } from 'next/server';
import * as lookService from '@/server/services/lookService';

// GET /api/products/:id/looks — public. Returns [] when the product
// isn't styled into any Look yet (not an error — most products won't be).
export async function GET(request, { params }) {
  const { id } = await params;
  const looks = await lookService.findByProduct(id);
  return NextResponse.json({ looks });
}
