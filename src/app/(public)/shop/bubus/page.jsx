import Shop from '@/views/shop/Shop';
import * as productService from '@/server/services/productService';
import { mapProductList } from '@/lib/product';

export const metadata = { title: 'Bùbús · YUWA' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { products } = await productService.findAll({ status: 'ACTIVE', limit: 100 });
  return <Shop products={products.map(mapProductList)} />;
}
