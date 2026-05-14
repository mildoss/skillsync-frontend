"use client";

import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="bg-destructive/10 text-destructive mb-6 flex size-20 items-center justify-center rounded-full">
        <XCircle className="size-12" />
      </div>

      <h1 className="text-foreground mb-4 text-4xl font-black tracking-tight sm:text-5xl">
        Payment Cancelled
      </h1>

      <p className="text-muted-foreground mx-auto max-w-md text-lg">
        No worries! Your account hasn&#39;t been charged. If you had issues with the payment, please try
        again or contact support.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="default" className="font-bold">
          <Link href="/pricing">
            <ArrowLeft className="mr-2 size-4" /> Back to Pricing
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
