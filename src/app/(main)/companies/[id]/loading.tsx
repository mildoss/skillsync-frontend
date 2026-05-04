import {ChevronLeft} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {CardSkeleton} from "@/components/shared/CardSkeleton";

export default function Loading() {
  return (
    <div className="relative container mx-auto px-4 py-8">
      <div className="flex items-center gap-1 mb-6 text-muted-foreground">
        <ChevronLeft className="size-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Skeleton className="size-20 sm:size-24 rounded-xl shrink-0" />
        <div className="flex flex-col pt-1 w-full max-w-md gap-3">
          <Skeleton className="h-8 sm:h-10 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">

          <section className="bg-card rounded-xl border p-6 sm:p-8 shadow-sm">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </section>

          <section>
            <Skeleton className="h-7 w-48 mb-6" />
            <div className="flex flex-col gap-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </section>

          <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
            <Skeleton className="h-7 w-32 mb-6" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="mb-3 size-16 rounded-full" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card sticky top-24 rounded-xl border p-6 shadow-sm">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-24 mb-6" />
            <Skeleton className="h-12 w-full rounded-lg mb-6" />

            <div className="space-y-5 border-t pt-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-5 shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}