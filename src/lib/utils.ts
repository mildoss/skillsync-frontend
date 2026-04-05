import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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