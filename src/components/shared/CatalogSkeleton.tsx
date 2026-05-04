import { CardSkeleton } from "@/components/shared/CardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const CatalogSkeleton = () => {
  return (
    <div className="relative container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-3" />
        <Skeleton className="h-5 w-96 max-w-full mb-6" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        <div className="sticky top-24 hidden lg:col-span-1 lg:block">
          <div className="bg-card space-y-6 rounded-lg border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};