import { CurrencyType } from "../../store/offerPreferences/types";

export const defaultCurrencies: Record<CurrencyType, Currency> = {
  europe: "EUR",
  latinAmerica: "ARS",
  africa: "USD",
  other: "USDT",
};
