import z from "zod";
export const CurrencyType = z.enum([
  "europe",
  "asia",
  "northAmerica",
  "latinAmerica",
  "middleEast",
  "oceania",
  "africa",
  "global",
]);
export type CurrencyType = z.infer<typeof CurrencyType>;
