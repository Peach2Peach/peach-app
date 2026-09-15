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
// Show the counterparty's payment details on completed trades (disabled for now)
// const withoutPastSharedFields = (fields: TradeInfoField[]) =>
//   fields.filter(
//     (field) => field !== "reference" && field !== "paymentConfirmed",
//   );

const pastCashBuyTradeFields = createPastBuyTradeFields(["meetup"]);
const pastBuyTradeFields = createPastBuyTradeFields([
  "via",
  "reference",
  "paymentConfirmed",
]);
// const pastBuyTradeFields = (fields: TradeInfoField[]) =>
//   createPastBuyTradeFields([
//     "via",
//     ...withoutPastSharedFields(fields),
//     "reference",
//     "paymentConfirmed",
//   ]);

const pastCashSellTradeFields = createPastSellTradeFields(["meetup"]);
const pastSellTradeFields = createPastSellTradeFields([
  "paidToMethod",
  "reference",
  "paymentConfirmed",
]);
// const pastSellTradeFields = (fields: TradeInfoField[]) =>
//   createPastSellTradeFields([
//     "paidToMethod",
//     ...withoutPastSharedFields(fields),
//     "reference",
//     "paymentConfirmed",
//   ]);

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

export const tradeFields = {
  buyer: {
    past: {
      cash: pastCashBuyTradeFields,
      default: pastBuyTradeFields,
    },
    active: {
      cash: activeCashBuyTradeFields,
      default: wrapInSharedFieldsBuyer,
    },
  },
  seller: {
    past: {
      cash: pastCashSellTradeFields,
      default: pastSellTradeFields,
    },
    active: {
      cash: activeCashSellTradeFields,
      default: wrapInSharedFieldsSeller,
    },
  },
};
