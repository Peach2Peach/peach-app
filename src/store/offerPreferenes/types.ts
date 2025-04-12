import z from "zod";
export const CurrencyType = z.enum([
  "europe",
  "latinAmerica",
  "africa",
  "asia",
  "oceania",
  "northAmerica",
  "other",
]);
export type CurrencyType = z.infer<typeof CurrencyType>;
