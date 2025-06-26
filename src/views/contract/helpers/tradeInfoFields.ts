import {
  GIFTCARDCOUNTRIES,
  NATIONALTRANSFERCOUNTRIES,
} from "../../../paymentMethods";
import { TradeInfoField } from "./tradeInformationGetters";

const createPastBuyTradeFields = (
  fields: TradeInfoField[],
): TradeInfoField[][] => [
  ["youPaid", "bitcoinPrice"],
  fields,
  ["seller", "ratingBuyer"],
  ["tradeBreakdown"],
];
const createPastSellTradeFields = (
  fields: TradeInfoField[],
): TradeInfoField[][] => [
  ["soldFor", "bitcoinPrice"],
  fields,
  ["buyer", "ratingSeller"],
];
const pastCashBuyTradeFields = createPastBuyTradeFields(["meetup"]);
const pastBuyTradeFields = createPastBuyTradeFields([
  "via",
  "reference",
  "paymentConfirmed",
]);

const pastCashSellTradeFields = createPastSellTradeFields(["meetup"]);
const pastSellTradeFields = createPastSellTradeFields([
  "paidToMethod",
  "reference",
  "paymentConfirmed",
]);

const createActiveBuyTradeFields = (
  fields: TradeInfoField[],
): TradeInfoField[][] => [["youShouldPay"], fields, ["seller", "tradeId"]];
const createActiveSellTradeFields = (
  fields: TradeInfoField[],
): TradeInfoField[][] => [["youWillGet"], fields, ["buyer", "tradeId"]];

const activeCashSellTradeFields = createActiveSellTradeFields([
  "meetup",
  "location",
]);
const activeSellTradeFields: TradeInfoField[][] = createActiveSellTradeFields([
  "paidToMethod",
  "reference",
]);

const activeCashBuyTradeFields = createActiveBuyTradeFields([
  "meetup",
  "location",
]);
const wrapInSharedFieldsBuyer = (
  fields: TradeInfoField[],
): TradeInfoField[][] => createActiveBuyTradeFields(["via", ...fields]);

const wrapInSharedFieldsSeller = (
  fields: TradeInfoField[],
): TradeInfoField[][] => createActiveSellTradeFields(["via", ...fields]);

const template1Fields: TradeInfoField[] = [
  "beneficiary",
  "iban",
  "bic",
  "reference",
];
const template2Fields: TradeInfoField[] = ["wallet", "email"];
const template3Fields: TradeInfoField[] = ["beneficiary", "phone", "reference"];
const template4Fields: TradeInfoField[] = ["beneficiary", "email", "reference"];
const template5Fields: TradeInfoField[] = [
  "beneficiary",
  "ukBankAccount",
  "ukSortCode",
  "reference",
];
const template6Fields: TradeInfoField[] = [
  "userName",
  "email",
  "phone",
  "reference",
];
const template7Fields: TradeInfoField[] = [
  "beneficiary",
  "accountNumber",
  "reference",
];
const template8Fields: TradeInfoField[] = ["beneficiary", "phone", "reference"];
const template9Fields: TradeInfoField[] = [
  "beneficiary",
  "iban",
  "accountNumber",
  "bic",
  "reference",
];
const template10Fields: TradeInfoField[] = ["receiveAddress"];
const template11Fields: TradeInfoField[] = ["lnurlAddress"];
const template12Fields: TradeInfoField[] = ["phone", "reference"];
const template13Fields: TradeInfoField[] = ["phone", "email", "reference"];
const template18Fields: TradeInfoField[] = ["userName", "reference"];
const template19Fields: TradeInfoField[] = ["userName"];
const template20Fields: TradeInfoField[] = ["beneficiary", "postePayNumber"];
const template22Fields: TradeInfoField[] = ["pixAlias"];

const CommonPaymentMethodFields = {
  sepa: template1Fields,
  fasterPayments: template5Fields,
  instantSepa: template1Fields,
  paypal: template6Fields,
  revolut: template6Fields,
  vipps: template3Fields,
  advcash: template2Fields,
  blik: template3Fields,
  wise: template6Fields,
  twint: template3Fields,
  swish: template3Fields,
  satispay: template3Fields,
  mbWay: template3Fields,
  bizum: template3Fields,
  mobilePay: template3Fields,
  skrill: template4Fields,
  neteller: template4Fields,
  paysera: template8Fields,
  straksbetaling: template7Fields,
  keksPay: template3Fields,
  friends24: template3Fields,
  n26: template6Fields,
  paylib: template3Fields,
  lydia: template3Fields,
  iris: template3Fields,
  papara: template3Fields,
  liquid: template10Fields,
  lnurl: template11Fields,
  rappipay: template12Fields,
  mercadoPago: template13Fields,
  nequi: template3Fields,
  cbu: template7Fields,
  cvu: template7Fields,
  alias: template7Fields,
  bancolombia: template7Fields,
  orangeMoney: template12Fields,
  moov: template12Fields,
  wave: template12Fields,
  airtelMoney: template12Fields,
  "m-pesa": template12Fields,
  nationalTransferNG: template7Fields,
  chippercash: template18Fields,
  mtn: template12Fields,
  eversend: template18Fields,
  payday: template18Fields,
  sinpe: template1Fields,
  sinpeMovil: template3Fields,
  pix: template22Fields,
  rebellion: template19Fields,
  klasha: template19Fields,
  accrue: template19Fields,
  wirepay: template19Fields,
  strike: template19Fields,
  bankera: template13Fields,
  postePay: template20Fields,
};

const BuyerPaymentMethodFields: {
  [key in PaymentMethod]?: TradeInfoField[][];
} = Object.fromEntries(
  Object.entries(CommonPaymentMethodFields).map(([key, value]) => [
    key,
    wrapInSharedFieldsBuyer(value),
  ]),
);

GIFTCARDCOUNTRIES.forEach(
  (c) =>
    (BuyerPaymentMethodFields[`giftCard.amazon.${c}`] =
      wrapInSharedFieldsBuyer(template4Fields)),
);

NATIONALTRANSFERCOUNTRIES.forEach(
  (c) =>
    (BuyerPaymentMethodFields[`nationalTransfer${c}`] =
      wrapInSharedFieldsBuyer(template9Fields)),
);

// SELLER

const SellerPaymentMethodFields: {
  [key in PaymentMethod]?: TradeInfoField[][];
} = Object.fromEntries(
  Object.entries(CommonPaymentMethodFields).map(([key, value]) => [
    key,
    wrapInSharedFieldsSeller(value),
  ]),
);

GIFTCARDCOUNTRIES.forEach(
  (c) =>
    (SellerPaymentMethodFields[`giftCard.amazon.${c}`] =
      wrapInSharedFieldsSeller(template4Fields)),
);

NATIONALTRANSFERCOUNTRIES.forEach(
  (c) =>
    (SellerPaymentMethodFields[`nationalTransfer${c}`] =
      wrapInSharedFieldsSeller(template9Fields)),
);

export const tradeFields = {
  buyer: {
    past: {
      cash: pastCashBuyTradeFields,
      default: pastBuyTradeFields,
    },
    active: {
      cash: activeCashBuyTradeFields,
      default: BuyerPaymentMethodFields,
    },
  },
  seller: {
    past: {
      cash: pastCashSellTradeFields,
      default: pastSellTradeFields,
    },
    active: {
      cash: activeCashSellTradeFields,
      default: SellerPaymentMethodFields,
    },
  },
};
