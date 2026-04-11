"use client";

import { useFilter } from "@/hooks/use-filter";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/components/ui/filters/FilterSection";
import { Input } from "@/components/ui/input";
import { FilterCheckboxGroup } from "@/components/ui/filters/FilterCheckboxGroup";
import { EMPLOYMENT_TYPES, EXPERIENCE_OPTIONS, LOCATION_OPTIONS, WORK_FORMATS } from "@/lib/utils";
import { Dictionaries } from "@/types/dictionaries";

type CandidateFiltersProps = {
  categories?: Dictionaries[];
  domains?: Dictionaries[];
  skills?: Dictionaries[];
  languages?: Dictionaries[];
};

export const CandidateFilters = ({
  categories = [],
  skills = [],
  languages = [],
}: CandidateFiltersProps) => {
  const { searchParams } = useFilter();
  const router = useRouter();
  const pathname = usePathname();

  const currentSearch = searchParams.get("search") || "";

  const [searchValue, setSearchValue] = useState(currentSearch);

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      let hasChanges = false;

      const updateParam = (key: string, value: string) => {
        const current = params.get(key) || "";
        if (current !== value) {
          if (value) params.set(key, value);
          else params.delete(key);
          hasChanges = true;
        }
      };

      updateParam("search", searchValue);

      if (hasChanges) {
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, pathname, router, searchParams]);

  const handleReset = () => {
    setSearchValue("");
    router.push(pathname);
  };

  const mapToOptions = (items: Dictionaries[]) =>
    items.map((item) => ({ label: item.name, value: item.id }));

  return (
    <div className="bg-card space-y-6 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {searchParams.toString().length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground h-8"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <FilterSection title="Search by keyword">
          <Input
            placeholder="Position, skills, keywords..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </FilterSection>

        {categories.length > 0 && (
          <FilterSection title="Category">
            <FilterCheckboxGroup paramKey="categoryId" options={mapToOptions(categories)} />
          </FilterSection>
        )}

        {skills.length > 0 && (
          <FilterSection title="Skills">
            <FilterCheckboxGroup paramKey="skills" options={mapToOptions(skills)} />
          </FilterSection>
        )}

        <FilterSection title="Experience">
          <FilterCheckboxGroup paramKey="experience" options={EXPERIENCE_OPTIONS} />
        </FilterSection>

        <FilterSection title="Work Format">
          <FilterCheckboxGroup paramKey="workFormats" options={WORK_FORMATS} />
        </FilterSection>

        <FilterSection title="Employment Type">
          <FilterCheckboxGroup paramKey="employmentTypes" options={EMPLOYMENT_TYPES} />
        </FilterSection>

        {languages.length > 0 && (
          <FilterSection title="Languages">
            <FilterCheckboxGroup paramKey="languages" options={mapToOptions(languages)} />
          </FilterSection>
        )}

        <FilterSection title="Location">
          <FilterCheckboxGroup paramKey="location" options={LOCATION_OPTIONS} />
        </FilterSection>
      </div>
    </div>
  );
};