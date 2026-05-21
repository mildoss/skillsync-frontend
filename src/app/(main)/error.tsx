"use client";

import { Button } from "@/components/ui/button";

interface NextError extends Error {
  digest?: string;
}

export default function Error({ error, reset }: { error: NextError; reset: () => void }) {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-2xl font-bold">Oops! Something went wrong.</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        We&#39;re having trouble reaching the server. Please try again or check back later.
      </p>

      {error.digest && (
        <p className="text-muted-foreground mb-6 font-mono text-xs">Error ID: {error.digest}</p>
      )}
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}