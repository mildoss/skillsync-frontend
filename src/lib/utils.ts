import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CompanyType, EmploymentType, LocationType, VacancyType } from "@/types/enums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min: number | null, max: number | null, currency: string = "USD") {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;

  if (min && max) return `${symbol}${min} - ${symbol}${max}`;
  if (min) return `From ${symbol}${min}`;
  if (max) return `Up to ${symbol}${max}`;
  return "Salary not specified";
}

export function formatExperience(exp: string | null) {
  if (!exp) return "Any experience";

  const num = parseInt(exp);
  if (!isNaN(num)) {
    if (num === 0) return "No experience";
    if (num === 1) return "1 year";
    return `${exp} years`;
  }

  return exp;
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (error) {
    return "";
  }
}

const enumToOptions = <T extends Record<string, string>>(e: T) =>
  Object.values(e).map((v) => ({ label: v, value: v }));

export const WORK_FORMATS = enumToOptions(VacancyType);
export const COMPANY_TYPES = enumToOptions(CompanyType);
export const EMPLOYMENT_TYPES = enumToOptions(EmploymentType);
export const LOCATION_OPTIONS = Object.keys(LocationType).map((key) => ({
  label: LocationType[key as keyof typeof LocationType],
  value: key, 
}));

export const EXPERIENCE_OPTIONS = [
  { label: "No experience", value: "0" },
  { label: "1 year", value: "1" },
  { label: "2 years", value: "2" },
  { label: "3 years", value: "3" },
  { label: "4 years", value: "4" },
  { label: "5+ years", value: "5" },
];