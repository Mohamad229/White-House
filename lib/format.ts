import type { Locale } from "./types";

export function formatMoney(amount: number, currency = "SYP", locale: Locale = "ar") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SY" : "en-US", {
    maximumFractionDigits: 0
  }).format(amount) + ` ${currency}`;
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
