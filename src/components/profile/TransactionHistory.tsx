"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Transaction } from "@/types/transactions";

export const TransactionHistory = ({ transactions }: { transactions: Transaction[] }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-muted/20 flex flex-col items-center justify-center rounded-3xl border py-12 text-center">
        <Clock className="text-muted-foreground mb-4 size-10 opacity-20" />
        <p className="text-muted-foreground font-medium">No transactions found yet.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="size-4 text-green-500 shrink-0" />;
      case "FAILED":
        return <XCircle className="text-destructive size-4 shrink-0" />;
      default:
        return <Clock className="size-4 text-yellow-500 shrink-0" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "FAILED":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    }
  };

  return (
    <>
      <div className="md:hidden space-y-2.5 px-0">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all hover:shadow-sm active:shadow-sm"
          >
            {/* Заголовок: дата и статус */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3">
              <span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
                {formatDate(tx.createdAt)}
              </span>
              <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold shrink-0 ${getStatusColor(tx.status)}`}>
                {getStatusIcon(tx.status)}
                <span className="hidden sm:inline">{tx.status}</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl sm:text-2xl font-black text-foreground leading-none">
                  ${(tx.amountTotal / 100).toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {tx.currency.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground">Tokens:</span>
                <span className="font-bold text-foreground">+{tx.creditsAdded}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-card overflow-x-auto rounded-3xl border">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/50 border-b hover:bg-transparent">
              <TableHead className="h-12 px-4 w-32 font-semibold">Date</TableHead>
              <TableHead className="h-12 px-4 font-semibold">Tokens</TableHead>
              <TableHead className="h-12 px-4 font-semibold">Amount</TableHead>
              <TableHead className="h-12 px-4 text-right font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow
                key={tx.id}
                className="hover:bg-muted/40 transition-colors border-b last:border-b-0"
              >
                <TableCell className="px-4 py-4 font-medium whitespace-nowrap text-sm">
                  {formatDate(tx.createdAt)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-2 font-bold whitespace-nowrap text-sm">
                    <span>+{tx.creditsAdded}</span>
                    <span className="text-muted-foreground text-xs tracking-tighter uppercase">
                      tokens
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-bold">${(tx.amountTotal / 100).toFixed(2)}</span>
                    <span className="text-muted-foreground text-xs">
                      {tx.currency.toUpperCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap ${getStatusColor(tx.status)}`}>
                    {getStatusIcon(tx.status)}
                    <span>{tx.status}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};