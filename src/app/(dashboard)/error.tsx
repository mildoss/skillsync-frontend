"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="bg-card flex min-h-[50vh] flex-col items-center justify-center rounded-xl border p-8 text-center shadow-sm">
      <div className="bg-destructive/10 text-destructive mb-6 rounded-full p-4">
        <AlertTriangle className="size-10" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn&#39;t load this section of your dashboard. Error: {error.message}
      </p>
      <Button onClick={() => reset()} size="lg">
        Try again
      </Button>
    </div>
  );
}