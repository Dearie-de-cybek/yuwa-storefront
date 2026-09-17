import Skeleton from '../ui/Skeleton';

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-[3/4] w-full rounded-none" />
        <div className="space-y-6 pt-8">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-24" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
