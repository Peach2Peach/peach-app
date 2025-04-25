import { TradeStatus } from "../../../../peach-api/src/@types/offer";
import { statusIcons } from "./statusIcons";

export const isTradeStatus = (
  tradeStatus: string,
): tradeStatus is TradeStatus => tradeStatus in statusIcons;
