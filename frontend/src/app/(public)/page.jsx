import HomePage from '@/views/home/HomePage';
import * as productService from '@/server/services/productService';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [{ products }, occasionSummary] = await Promise.all([
    productService.findAll({ status: 'ACTIVE', featured: 'true', limit: 6 }),
    productService.occasionSummary(['WEDDING', 'PROM', 'DINNER']),
  ]);

  return <HomePage featured={products} occasionSummary={occasionSummary} />;
}
