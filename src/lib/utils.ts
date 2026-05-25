import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(amount: number, currencyCode = "INR", locale = "en-IN") {
  const key = `${locale}-${currencyCode}`;
  let formatter = formatters.get(key);
  
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    });
    formatters.set(key, formatter);
  }
  
  return formatter.format(amount);
}
