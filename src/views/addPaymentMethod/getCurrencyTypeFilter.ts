import { Currency } from "../../../peach-api/src/@types/global";
import { CurrencyType } from "../../store/offerPreferenes/types";

const CURRENCY_MAP: Record<CurrencyType, Currency[]> = {
  africa: ["XOF", "CDF", "NGN", "ZAR", "MAD", "KES", "TZS"],
  asia: [
    "KZT",
    "INR",
    "SGD",
    "TRY",
    "PHP",
    "JPY",
    "IDR",
    "MYR",
    "CNY",
    "PKR",
    "VND",
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
    "BRL",
    "COP",
    "HNL",
    "BOB",
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
  middleEast: ["ILS", "AED", "EGP", "SAR"],
  northAmerica: ["CAD"],
  oceania: ["NZD", "AUD"],
  global: ["USDT", "SAT", "USD"],
};

export const getCurrencyTypeFilter =
  (type: CurrencyType) => (currency: Currency) =>
    CURRENCY_MAP[type].includes(currency);
