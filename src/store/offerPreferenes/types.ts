import z from "zod";
export const CurrencyType = z.enum([
  "europe",
  "asia",
  "northAmerica",
  "latinAmerica",
  "middleEast",
  "oceania",
  "africa",
  "other",
]);
export type CurrencyType = z.infer<typeof CurrencyType>;
