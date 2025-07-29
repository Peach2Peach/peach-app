import { CurrencyType } from "../../store/offerPreferenes/types";

export const defaultCurrencies: Record<CurrencyType, Currency> = {
  europe: "EUR",
  latinAmerica: "ARS",
  africa: "ZAR",
  global: "USDT",
  asia: "AED",
  northAmerica: "CAD",
  middleEast: "ILS",
  oceania: "AUD",
};
