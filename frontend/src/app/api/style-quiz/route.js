import { NextResponse } from 'next/server';
import * as styleQuizService from '@/server/services/styleQuizService';
import { queryParams } from '@/server/auth';

// GET /api/style-quiz?occasion=WEDDING&mood=ELEGANT&silhouette=FLOWING — public
export async function GET(request) {
  const { occasion, mood, silhouette } = queryParams(request);
  const result = await styleQuizService.recommend({ occasion, mood, silhouette });

  if (result.error === 'invalid_occasion') return NextResponse.json({ message: 'A valid occasion is required' }, { status: 400 });
  if (result.error === 'invalid_mood') return NextResponse.json({ message: 'Invalid mood' }, { status: 400 });
  if (result.error === 'invalid_silhouette') return NextResponse.json({ message: 'Invalid silhouette' }, { status: 400 });

  return NextResponse.json(result);
}
