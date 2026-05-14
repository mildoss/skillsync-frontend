import { getMe } from "@/lib/server-api";
import { getMyTransactions } from "@/lib/server-api";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import { Sparkles, CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BillingPage() {
  const [user, transactions] = await Promise.all([getMe(), getMyTransactions()]);

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12">
      <div className="container max-w-5xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:gap-6 md:flex-row md:items-center md:gap-8">
          <div className="flex-1">
            <h1 className="mb-1 sm:mb-2 text-3xl sm:text-4xl font-black tracking-tight">Billing</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your credits and transaction history.
            </p>
          </div>

          <div className="w-full md:w-auto bg-primary/5 border-primary/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-sm">
            <div className="bg-primary/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 shrink-0">
              <Sparkles className="text-primary size-6 sm:size-8" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs sm:text-sm font-medium tracking-wider uppercase">
                Available Balance
              </p>
              <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-2xl sm:text-4xl font-black">{user.aiCredits}</span>
                <span className="text-primary text-xs sm:text-sm font-bold">Tokens</span>
              </div>
            </div>
            <Button asChild className="w-full sm:w-auto h-10 sm:h-12 rounded-full px-4 sm:px-6 text-sm sm:text-base shrink-0 mt-2 sm:mt-0">
              <Link href="/pricing" className="flex items-center justify-center gap-2">
                <Plus className="size-4" /> Top Up
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="flex items-center gap-2">
            <CreditCard className="text-primary size-5 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold">Transaction History</h2>
          </div>

          <TransactionHistory transactions={transactions} />
        </div>

        <div className="bg-muted/30 flex flex-col items-center rounded-2xl sm:rounded-3xl border border-dashed p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            All payments are processed securely via <strong>Stripe</strong>. Tokens have no expiration
            date and can be used for any AI generation feature.
          </p>
        </div>
      </div>
    </div>
  );
}