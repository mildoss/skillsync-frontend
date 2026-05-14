"use client";

import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createCheckoutSessionAction } from "@/actions/payment";
import { toast } from "sonner";
import { PackageId } from "@/types/payments";
import { useRouter } from "next/navigation";


interface PricingCardProps {
  id: PackageId;
  title: string;
  price: string;
  oldPrice: string;
  credits: number;
  description: string;
  isPopular?: boolean;
  isLoggedIn: boolean;
}

export const PricingCard = ({
  id,
  title,
  price,
  oldPrice,
  credits,
  description,
  isPopular = false,
  isLoggedIn,
}: PricingCardProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePurchase = () => {
    if (!isLoggedIn) {
      toast.error("Please login to purchase credits");
      router.push("/login");
      return;
    }

    startTransition(async () => {
      const res = await createCheckoutSessionAction(id);

      if (res.error) {
        toast.error(res.error);
      } else if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    });
  };

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 ${
        isPopular
          ? "border-primary bg-card z-10 scale-105 shadow-lg"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      {isPopular && (
        <div className="bg-primary text-primary-foreground absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
          Best Value
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-foreground text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground text-5xl font-black tracking-tight">${price}</span>
          <span className="text-muted-foreground/60 text-lg font-medium line-through">
            ${oldPrice}
          </span>
        </div>
        <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wider uppercase">
          USD One-time payment
        </p>
      </div>

      <div className="bg-muted/50 mb-10 space-y-4 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-foreground text-lg leading-none font-bold">{credits} AI Tokens</p>
            <p className="text-muted-foreground mt-1 text-[10px] tracking-tighter uppercase">
              for all ai features
            </p>
          </div>
        </div>
      </div>

      <ul className="mb-10 flex-1 space-y-4">
        {["AI Cover Letter", "AI Vacancy Description", "AI Match Score"].map((feature) => (
          <li key={feature} className="text-foreground flex items-center gap-3 text-sm font-medium">
            <Check className="text-primary size-5 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={handlePurchase}
        disabled={isPending}
        variant={isPopular ? "default" : "outline"}
        size="lg"
        className="w-full py-6 text-base font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Zap className="size-4 animate-pulse" /> Processing...
          </span>
        ) : (
          "Choose Plan"
        )}
      </Button>
    </div>
  );
};
