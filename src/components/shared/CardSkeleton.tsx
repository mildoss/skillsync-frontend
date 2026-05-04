import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => {
  return (
    <div className="bg-card mb-4 block rounded-lg border p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex w-full gap-3 sm:gap-4">
          <Skeleton className="size-10 shrink-0 rounded-xl sm:size-12" />

          <div className="flex w-full max-w-50 flex-col space-y-2">
            <Skeleton className="h-5 w-full sm:h-6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="hidden shrink-0 space-y-2 sm:block sm:text-right">
          <Skeleton className="ml-auto h-6 w-24" />
          <Skeleton className="ml-auto h-3 w-16" />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
};
