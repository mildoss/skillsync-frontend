import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <Skeleton className="mb-4 h-10 w-64" />
        <Skeleton className="mb-8 h-6 w-full max-w-2xl" />
        <Skeleton className="h-14 w-full max-w-xl rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card flex flex-col rounded-xl border p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Skeleton className="size-16 shrink-0 rounded-xl" />
              <div className="flex w-full flex-col gap-2 pt-1">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="mt-6 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <div className="mt-6 flex gap-4 border-t pt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
