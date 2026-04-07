"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = useCallback((name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  return {searchParams, setFilter};
};