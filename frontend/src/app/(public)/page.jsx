import HomePage from '@/views/home/HomePage';
import * as productService from '@/server/services/productService';
import * as brandStoryService from '@/server/services/brandStoryService';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [{ products }, occasionSummary, story] = await Promise.all([
    productService.findAll({ status: 'ACTIVE', featured: 'true', limit: 6 }),
    productService.occasionSummary(['WEDDING', 'PROM', 'DINNER']),
    brandStoryService.get(),
  ]);

  return <HomePage featured={products} occasionSummary={occasionSummary} story={story} />;
}
