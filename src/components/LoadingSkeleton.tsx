import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => (
  <div className="rounded-lg border bg-card overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square rounded" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-12" />
        </div>
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="border rounded-lg overflow-hidden">
    <div className="bg-muted p-4">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
    </div>
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="p-4 flex gap-4">
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton key={col} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen">
    <Skeleton className="h-16 w-full" />
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <ProductGridSkeleton count={4} />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
    <Skeleton className="h-10 w-full max-w-md" />
    <TableSkeleton />
  </div>
);
