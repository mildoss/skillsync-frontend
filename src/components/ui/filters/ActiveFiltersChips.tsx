"use client";

import { useFilter } from "@/hooks/use-filter";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dictionaries } from "@/types/dictionaries";
import { COMPANY_TYPES, EXPERIENCE_OPTIONS, LOCATION_OPTIONS, WORK_FORMATS } from "@/lib/utils";

type ActiveFiltersChipsProps = {
  categories?: Dictionaries[];
  domains?: Dictionaries[];
  skills?: Dictionaries[];
  languages?: Dictionaries[];
};

export const ActiveFiltersChips = ({
  categories = [],
  domains = [],
  skills = [],
  languages = [],
}: ActiveFiltersChipsProps) => {
  const { searchParams, setFilter } = useFilter();
  const router = useRouter();
  const pathname = usePathname();

  const params = Array.from(searchParams.entries()).filter(([key]) => key !== "page");

  if (params.length === 0) return null;

  const getDisplayValue = (key: string, val: string) => {
    if (key === "salaryMin") return `From $${val}`;
    if (key === "categoryId") return categories.find((c) => c.id === val)?.name || val;
    if (key === "skills") return skills.find((s) => s.id === val)?.name || val;
    if (key === "languages") return languages.find((l) => l.id === val)?.name || val;
    if (key === "domain") return domains.find((d) => d.id === val)?.name || val;
    if (key === "experience") return EXPERIENCE_OPTIONS.find((e) => e.value === val)?.label || val;
    if (key === "type") return WORK_FORMATS.find((w) => w.value === val)?.label || val;
    if (key === "companyType") return COMPANY_TYPES.find((c) => c.value === val)?.label || val;
    if (key === "location") return LOCATION_OPTIONS.find((l) => l.value === val)?.label || val;
    return val;
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {params.map(([key, value]) => {
        const values = value.split(",");

        return values.map((val) => (
          <Badge
            key={`${key}-${val}`}
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 flex items-center gap-1 py-1 text-sm p-3"
          >
            {getDisplayValue(key, val)}
            <button
              onClick={() => {
                const currentValues = searchParams.get(key)?.split(",") || [];
                const updatedValues = currentValues.filter((v) => v !== val);
                setFilter(key, updatedValues.length > 0 ? updatedValues.join(",") : null);
              }}
              className="hover:bg-primary/20 ml-1 cursor-pointer rounded-full p-0.5 transition-colors"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ));
      })}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(pathname)}
        className="text-muted-foreground hover:text-foreground h-7 cursor-pointer"
      >
        Clear all
      </Button>
    </div>
  );
};
