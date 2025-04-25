import { ContractSummary } from "../../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../../peach-api/src/@types/offer";
import { IconType } from "../../../assets/icons";
import { statusCardStyles } from "../../../components/statusCard/statusCardStyles";
import { getDisputeResultTheme } from "./getDisputeResultTheme";
import { getOfferColor } from "./getOfferColor";
import { isContractSummary } from "./isContractSummary";

export type TradeTheme = {
  iconId: IconType;
  color: keyof typeof statusCardStyles.bg;
};

export const getThemeForTradeItem = (
  trade: OfferSummary | ContractSummary,
): TradeTheme => {
  const color = getOfferColor(trade);

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return getDisputeResultTheme(trade);
    if (trade.tradeStatus === "paymentTooLate")
      return { iconId: "watch", color };
    if (trade.tradeStatus !== "tradeCanceled") {
      return {
        iconId: trade.type === "ask" ? "sell" : "buy",
        color,
      };
    }
  }
  if ("refunded" in trade && trade.refunded)
    return { iconId: "rotateCounterClockwise", color };

  return {
    iconId: "xCircle",
    color,
  };
};
