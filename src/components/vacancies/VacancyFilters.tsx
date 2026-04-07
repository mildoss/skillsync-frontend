"use client";

import { useFilter } from "@/hooks/use-filter";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/components/ui/filters/FilterSection";
import { Input } from "@/components/ui/input";
import { FilterCheckboxGroup } from "@/components/ui/filters/FilterCheckboxGroup";
import { COMPANY_TYPES, EXPERIENCE_OPTIONS, LOCATION_OPTIONS, WORK_FORMATS } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Dictionaries } from "@/types/dictionaries";

type VacancyFiltersProps = {
  categories?: Dictionaries[];
  domains?: Dictionaries[];
  skills?: Dictionaries[];
  languages?: Dictionaries[];
};

export const VacancyFilters = ({
  categories = [],
  domains = [],
  skills = [],
  languages = [],
}: VacancyFiltersProps) => {
  const { searchParams, setFilter } = useFilter();
  const router = useRouter();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [salaryValue, setSalaryValue] = useState<number[]>(
    searchParams.get("salaryMin") ? [Number(searchParams.get("salaryMin"))] : [0],
  );

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
    setSalaryValue([0]);
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

        <FilterSection title={`Minimum Salary: ${salaryValue[0] > 0 ? '$' + salaryValue[0] : 'Any'}`}>
          <Slider
            min={0}
            max={15000}
            step={500}
            value={salaryValue}
            onValueChange={setSalaryValue}
            onValueCommit={(val) => {
              setFilter("salaryMin", val[0] > 0 ? val[0].toString() : null);
            }}
            className="py-4"
          />
        </FilterSection>

        <FilterSection title="Experience">
          <FilterCheckboxGroup paramKey="experience" options={EXPERIENCE_OPTIONS} />
        </FilterSection>

        <FilterSection title="Work Format">
          <FilterCheckboxGroup paramKey="type" options={WORK_FORMATS} />
        </FilterSection>

        <FilterSection title="Company Type">
          <FilterCheckboxGroup paramKey="companyType" options={COMPANY_TYPES} />
        </FilterSection>

        {languages.length > 0 && (
          <FilterSection title="Languages">
            <FilterCheckboxGroup paramKey="languages" options={mapToOptions(languages)} />
          </FilterSection>
        )}

        {domains.length > 0 && (
          <FilterSection title="Domain">
            <FilterCheckboxGroup paramKey="domain" options={mapToOptions(domains)} />
          </FilterSection>
        )}

        <FilterSection title="Location">
          <FilterCheckboxGroup paramKey="location" options={LOCATION_OPTIONS} />
        </FilterSection>
      </div>
    </div>
  );
};