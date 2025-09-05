import { statusIcons } from "./statusIcons";

export const isTradeStatus = (
  tradeStatus?: string,
): tradeStatus is TradeStatus =>
  tradeStatus !== undefined && tradeStatus in statusIcons;
