import { ContractSummary } from "../../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../../peach-api/src/@types/offer";
import { statusCardStyles } from "../../../components/statusCard/statusCardStyles";
import { isContractSummary } from "./isContractSummary";
import { isError } from "./isError";
import { isPastOffer } from "./isPastOffer";
import { isPrioritary } from "./isPrioritary";
import { isTradeStatus } from "./isTradeStatus";
import { isWaiting } from "./isWaiting";

export const getOfferColor = (
  trade: OfferSummary | ContractSummary,
): keyof typeof statusCardStyles.bg => {
  const { tradeStatus, type } = trade;

  if (!isTradeStatus(trade.tradeStatus)) return "info";
  if (tradeStatus === "paymentTooLate") return "warning";
  if (isPastOffer(tradeStatus)) {
    if (tradeStatus === "tradeCompleted")
      return type === "ask" ? "primary" : "success";
    return "black";
  }
  if (
    [
      "confirmCancelation",
      "refundOrReviveRequired",
      "refundTxSignatureRequired",
    ].includes(tradeStatus)
  )
    return "black";

  if (isError(tradeStatus)) return "error";
  if (isPrioritary(tradeStatus)) return "warning";
  if (isWaiting(type, tradeStatus)) return "primary-mild";

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return "warning";
  }

  return "primary";
};
