import { CurrencyType } from "../../store/offerPreferenes/types";

export const defaultCurrencies: Record<CurrencyType, Currency> = {
  europe: "EUR",
  latinAmerica: "ARS",
  africa: "USD",
  asia: "ILS", // TODO
  oceania: "NZD",
  other: "USDT",
};
