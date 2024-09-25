import { PaymentMethodCountry } from "../peach-api/src/@types/offer";
import { PaymentMethodInfo } from "../peach-api/src/@types/payment";
import { uniqueArray } from "./utils/array/uniqueArray";
import { isCashTrade } from "./utils/paymentMethod/isCashTrade";

export let CURRENCIES: Currency[] = [
  "SAT",
  "EUR",
  "CHF",
  "USD",
  "GBP",
  "SEK",
  "DKK",
  "BGN",
  "CZK",
  "HUF",
  "PLN",
  "RON",
  "ISK",
  "NOK",
  "TRY",
  "USDT",
  "ARS",
  "COP",
  "PEN",
  "MXN",
  "CLP",
  "PEN",
  "COP",
  "XOF",
  "NGN",
  "CDF",
  "CRC",
  "BRL",
];

export let GIFTCARDCOUNTRIES: PaymentMethodCountry[] = [
  "DE",
  "FR",
  "IT",
  "ES",
  "NL",
  "UK",
  "SE",
  "FI",
];
export const NATIONALTRANSFERCOUNTRIES = [
  "BG",
  "CZ",
  "DK",
  "HU",
  "NO",
  "PL",
  "RO",
  "CH",
  "IS",
  "SE",
  "TR",
  "NG",
] as const;

const bankTransfer: PaymentMethod[] = [
  "alias",
  "bancolombia",
  "cbu",
  "cvu",
  "fasterPayments",
  "instantSepa",
  "sepa",
  "sinpe",
  "straksbetaling",
  ...NATIONALTRANSFERCOUNTRIES.map(
    (c) => `nationalTransfer${c}` satisfies PaymentMethod,
  ),
];
const onlineWallet: PaymentMethod[] = [
  "accrue",
  "advcash",
  "airtelMoney",
  "bankera",
  "blik",
  "chippercash",
  "eversend",
  "friends24",
  "klasha",
  "m-pesa",
  "mercadoPago",
  "mobilePay",
  "moov",
  "mtn",
  "n26",
  "nequi",
  "neteller",
  "orangeMoney",
  "papara",
  "payday",
  "paypal",
  "paysera",
  "rappipay",
  "revolut",
  "sinpeMovil",
  "skrill",
  "strike",
  "swish",
  "twint",
  "vipps",
  "wave",
  "wirepay",
  "wise",
];
const giftCard: PaymentMethod[] = [
  "giftCard.amazon",
  ...GIFTCARDCOUNTRIES.map(
    (c) => `giftCard.amazon.${c}` satisfies PaymentMethod,
  ),
];
const nationalOption: PaymentMethod[] = [
  "bizum",
  "iris",
  "keksPay",
  "lydia",
  "mbWay",
  "mobilePay",
  "paylib",
  "pix",
  "postePay",
  "rebellion",
  "satispay",
];
const other: PaymentMethod[] = ["liquid", "lnurl"];

export const PAYMENTCATEGORIES: PaymentCategories = {
  bankTransfer,
  onlineWallet,
  giftCard,
  nationalOption,
  cash: [],
  other,
};

export const setPaymentMethods = (paymentMethodInfos: PaymentMethodInfo[]) => {
  CURRENCIES = paymentMethodInfos
    .reduce((arr: Currency[], info) => arr.concat(info.currencies), [])
    .filter(uniqueArray);
  GIFTCARDCOUNTRIES = paymentMethodInfos
    .reduce(
      (arr: PaymentMethodCountry[], info) => arr.concat(info.countries || []),
      [],
    )
    .filter(uniqueArray);
  PAYMENTCATEGORIES.cash.push(
    ...paymentMethodInfos.map(({ id }) => id).filter(isCashTrade),
  );
};
