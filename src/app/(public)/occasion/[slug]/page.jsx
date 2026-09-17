import { notFound } from 'next/navigation';
import OccasionShop from '@/views/occasion/OccasionShop';
import * as productService from '@/server/services/productService';
import { mapProductList } from '@/lib/product';
import { occasionBySlug } from '@/lib/occasions';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const o = occasionBySlug(slug);
  if (!o) return { title: 'Occasion · YUWA' };
  return { title: `${o.title} · YUWA`, description: o.tagline };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const occasion = occasionBySlug(slug);
  if (!occasion) notFound();

  const { products } = await productService.findAll({
    status: 'ACTIVE',
    occasion: occasion.value,
    limit: 100,
  });

  return <OccasionShop occasion={occasion} products={products.map(mapProductList)} />;
}
