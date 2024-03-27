import z from "zod";
export const CurrencyType = z.enum([
  "europe",
  "latinAmerica",
  "africa",
  "asia",
  "other",
]);
export type CurrencyType = z.infer<typeof CurrencyType>;
