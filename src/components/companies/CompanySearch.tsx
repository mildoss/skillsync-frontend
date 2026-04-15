"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFilter } from "@/hooks/use-filter";
import { useEffect, useState } from "react";

export const CompanySearch = () => {
  const {searchParams, setFilter} = useFilter();
  const currentSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        setFilter("search", searchValue || null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, currentSearch, setFilter]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2" />
      <Input
        placeholder="Search companies by name..."
        className="h-14 rounded-xl pl-11 text-base shadow-sm"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
}