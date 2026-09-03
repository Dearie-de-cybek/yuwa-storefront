import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';

// Sign a 30-day JWT for a user id (mirrors the old utils/generateToken).
export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Read the Bearer token from a request, verify it, and load the user.
// Returns the Prisma user record, or null when unauthenticated.
export async function getAuthUser(request) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return null;

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await prisma.user.findUnique({ where: { id: decoded.id } });
  } catch {
    return null;
  }
}

export function unauthorized(message = 'Not authorized, no token') {
  return NextResponse.json({ message }, { status: 401 });
}

// Guard: require any authenticated user. Returns { user } or { error: Response }.
export async function requireUser(request) {
  const user = await getAuthUser(request);
  if (!user) return { error: unauthorized() };
  return { user };
}

// Guard: require an ADMIN user. Returns { user } or { error: Response }.
export async function requireAdmin(request) {
  const user = await getAuthUser(request);
  if (!user) return { error: unauthorized() };
  if (user.role !== 'ADMIN') return { error: unauthorized('Not authorized as an Admin') };
  return { user };
}

// Turn a request's query string into a plain object for the service layer.
export function queryParams(request) {
  return Object.fromEntries(new URL(request.url).searchParams);
}
