import { PricingCard } from "@/components/pricing/PricingCard";
import { PRICING_PLANS } from "@/lib/constans";
import { getMe } from "@/lib/server-api";

export default async function PricingPage() {
  const user = await getMe();

  return (
    <div className="container mx-auto p-10">
      <div className="mb-20 text-center">
        <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-6xl">
          Supercharge your workflow with <span className="text-primary">AI</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Use tokens to unlock all AI features across the platform. One token equals one generation.
          Credits never expire.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.id} {...plan} isLoggedIn={!!user} />
        ))}
      </div>

      <div className="mt-24 grid grid-cols-1 gap-12 border-t pt-16 md:grid-cols-3">
        <div className="space-y-3 text-center">
          <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold">
            1
          </div>
          <h3 className="text-lg font-bold">AI Cover Letter</h3>
          <p className="text-muted-foreground text-sm">
            Craft compelling cover letters that instantly grab recruiters&#39; attention.
          </p>
        </div>
        <div className="space-y-3 text-center">
          <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold">
            2
          </div>
          <h3 className="text-lg font-bold">AI Vacancy Description</h3>
          <p className="text-muted-foreground text-sm">
            Generate professional job postings instantly based on your keywords.
          </p>
        </div>
        <div className="space-y-3 text-center">
          <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold">
            3
          </div>
          <h3 className="text-lg font-bold">AI Match Score</h3>
          <p className="text-muted-foreground text-sm">
            Instantly evaluate how well a candidate fits your job requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
