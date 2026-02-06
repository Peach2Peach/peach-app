import { Currency } from "../../../peach-api/src/@types/global";
import { CurrencyType } from "../../store/offerPreferenes/types";

const CURRENCY_MAP: Record<CurrencyType, Currency[]> = {
  africa: ["XOF", "CDF", "ZAR", "KES", "TZS"],
  asia: [
    "KZT",
    "INR",
    "SGD",
    "TRY",
    "PHP",
    "JPY",
    "MYR",
  ],
  europe: [
    "EUR",
    "CHF",
    "GBP",
    "CZK",
    "DKK",
    "HUF",
    "PLN",
    "NOK",
    "SEK",
    "BGN",
    "ISK",
    "RON",
    "TRY",
  ],
  latinAmerica: [
    "DOC",
    "BRL",
    "COP",
    "HNL",
    "PYG",
    "GTQ",
    "MXN",
    "CLP",
    "ARS",
    "CRC",
    "UYU",
    "PEN",
    "DOP",
    "PAB",
    "VEF",
    "VES",
  ],
  middleEast: ["ILS", "AED", "SAR"],
  northAmerica: ["USD", "CAD", "USDT", "DOC"],
  oceania: ["NZD", "AUD"],
  global: ["USDT", "DOC", "SAT", "USD"],
};

export const getCurrencyTypeFilter =
  (type: CurrencyType) => (currency: Currency) =>
    CURRENCY_MAP[type].includes(currency);
