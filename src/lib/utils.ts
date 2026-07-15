import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  CAD: "CA$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
};

export function formatPrice(amount: string | number, currencyCode: string = "USD") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  const symbol = CURRENCY_SYMBOLS[currencyCode];
  if (symbol) return `${symbol}${value.toFixed(2)}`;
  return `${currencyCode} ${value.toFixed(2)}`;
}
