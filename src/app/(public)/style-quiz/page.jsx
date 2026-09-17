import StyleQuiz from '@/components/quiz/StyleQuiz';

export const metadata = {
  title: 'Style Quiz · YUWA',
  description: "What's the occasion? Answer three questions and get your edit — curated from the live YUWA collection.",
};

const VALID_OCCASIONS = ['WEDDING', 'PROM', 'DINNER', 'EVERYDAY'];

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const initialOccasion = VALID_OCCASIONS.includes(sp?.occasion) ? sp.occasion : null;
  return <StyleQuiz initialOccasion={initialOccasion} />;
}
