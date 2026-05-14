"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="bg-primary/10 mb-6 flex size-20 items-center justify-center rounded-full text-primary">
        <CheckCircle2 className="size-12" />
      </div>

      <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
        Payment Successful!
      </h1>

      <div className="bg-muted/50 border-border mx-auto max-w-md rounded-2xl border p-6">
        <div className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-primary">
          <Sparkles className="size-5" />
          <span>Tokens are on their way</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your credits will be added to your balance within 1-2 minutes.
          This happens as soon as we receive confirmation from the payment provider.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="font-bold">
          <Link href="/vacancies">Browse Vacancies</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/profile">View Profile</Link>
        </Button>
      </div>
    </div>
  );
}