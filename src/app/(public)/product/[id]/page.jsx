import { notFound } from 'next/navigation';
import ProductDetails from '@/views/product/ProductDetails';
import * as productService from '@/server/services/productService';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await productService.findById(id);
  if (!p) return { title: 'Product not found · YUWA' };
  return {
    title: `${p.name} · YUWA`,
    description: p.metaDescription || p.description?.slice(0, 150) || 'YUWA luxury African fashion.',
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const detail = await productService.findById(id);
  if (!detail) notFound();
  return <ProductDetails detail={detail} />;
}
