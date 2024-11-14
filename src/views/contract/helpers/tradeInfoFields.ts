import { PaymentMethod } from "../../../../peach-api/src/@types/payment";
import { useConfigStore } from "../../../store/configStore/configStore";
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

export const tradeFields = {
  buyer: {
    past: {
      cash: pastCashBuyTradeFields,
      default: pastBuyTradeFields,
    },
    active: {
      cash: activeCashBuyTradeFields,
      default: (method: PaymentMethod) => {
        const fields = useConfigStore
          .getState()
          .paymentMethods.find((pm) => pm.id === method)?.fields;
        if (!fields) return [];

        return createActiveBuyTradeFields([
          "via",
          ...fields.mandatory.flat(2).concat(fields.optional.flat()),
        ]);
      },
    },
  },
  seller: {
    past: {
      cash: pastCashSellTradeFields,
      default: pastSellTradeFields,
    },
    active: {
      cash: activeCashSellTradeFields,
      default: activeSellTradeFields,
    },
  },
};
