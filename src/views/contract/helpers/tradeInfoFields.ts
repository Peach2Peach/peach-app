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
