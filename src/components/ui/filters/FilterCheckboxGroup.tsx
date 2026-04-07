"use client";

import { useFilter } from "@/hooks/use-filter";
import { Checkbox } from "@/components/ui/checkbox";

type Option = {
  label: string;
  value: string;
}

type FilterCheckboxGroupProps = {
  paramKey: string;
  options: Option[];
}

export const FilterCheckboxGroup = ({ paramKey, options }: FilterCheckboxGroupProps) => {
  const { searchParams, setFilter } = useFilter();

  const currentValues = searchParams.get(paramKey)?.split(",") || [];

  const toggleOption = (optionValue: string) => {
    let newValues;

    if (currentValues.includes(optionValue)) {
      newValues = currentValues.filter((v) => v !== optionValue);
    } else {
      newValues = [...currentValues, optionValue];
    }

    setFilter(paramKey, newValues.length > 0 ? newValues.join(",") : null);
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="group flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={currentValues.includes(option.value)}
            onCheckedChange={() => toggleOption(option.value)}
          />
          <span className="text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};