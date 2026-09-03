import HomePage from '@/views/home/HomePage';
import * as productService from '@/server/services/productService';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { products } = await productService.findAll({ status: 'ACTIVE', featured: 'true', limit: 2 });
  return <HomePage featured={products} />;
}
