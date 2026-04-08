"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-2xl font-bold">Oops! Something went wrong.</h2>
      <p className="text-muted-foreground mb-6">
        Unable to load job postings. Error: {error.message}.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}