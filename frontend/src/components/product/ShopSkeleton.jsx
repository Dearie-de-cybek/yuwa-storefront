import Skeleton from '../ui/Skeleton';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ShopSkeleton() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-white">
      <div className="max-w-[1440px] mx-auto mb-8">
        <Skeleton className="h-10 w-72 mb-3" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 max-w-[1440px] mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
