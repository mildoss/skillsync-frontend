"use client";

import { useState, useTransition, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchCompaniesAction, joinCompanyAction } from "@/actions/company";
import { Companies } from "@/types/companies";
import { useDebounce } from "@/hooks/use-debounce";
import { User } from "@/types/users";
import { JoinCompanyCard } from "@/components/companies/JoinCompanyCard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const JoinCompanyForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<Companies[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(
    new Set(user.pendingCompanyIds || []),
  );
  const [isSearching, startSearch] = useTransition();
  const [isJoining, startJoining] = useTransition();

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    startSearch(async () => {
      const res = await searchCompaniesAction(debouncedQuery);

      if (res.error) {
        toast.error(res.error);
      } else {
        setResults(res.data || []);
        setHasSearched(true);
      }
    });
  }, [debouncedQuery]);

  const handleJoin = (companyId: string) => {
    startJoining(async () => {
      const res = await joinCompanyAction(companyId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Join request sent!");
        setSentRequests((prev) => new Set(prev).add(companyId));
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">

      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Type company name... (e.g. Google)"
          className="h-11 pl-9"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);

            if (!val.trim()) {
              setResults([]);
              setHasSearched(false);
            }
          }}
        />
        {isSearching && (
          <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs">
            Searching...
          </span>
        )}
      </div>

      <div className="space-y-4">
        {hasSearched && results.length === 0 && !isSearching && (
          <div className="border-border text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm">
            No companies found. Try a different name.
          </div>
        )}

        {results.map((company) => (
          <JoinCompanyCard
            key={company.id}
            company={company}
            isSent={sentRequests.has(company.id)}
            isJoining={isJoining}
            onJoin={handleJoin}
          />
        ))}
      </div>
    </div>
  );
};