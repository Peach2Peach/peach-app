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
  const { tradeStatus, tradeStatusNew, type } = trade;

  if (tradeStatusNew !== undefined) {
    if (tradeStatusNew === "waitingForTradeRequest") return "primary-mild";
    if (tradeStatusNew === "acceptTradeRequest") return "primary";
  }

  if (!isTradeStatus(trade.tradeStatus)) return "info";
  if (tradeStatus === "paymentTooLate") return "warning";
  if (isPastOffer(tradeStatus, type)) {
    if (tradeStatus === "tradeCompleted")
      return type === "ask" ? "primary" : "success";
    return "black";
  }
  if (
    [
      "confirmCancelation",
      "refundOrReviveRequired",
      "refundTxSignatureRequired",
      "wrongAmountFundedOnContractRefundWaiting",
    ].includes(tradeStatus)
  )
    return "black";

  if (isError(tradeStatus)) return "error";
  if (isPrioritary(tradeStatus)) return "warning";
  if (isWaiting(type, tradeStatus) || isWaiting(type, tradeStatusNew))
    return "primary-mild";

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return "warning";
  }

  return "primary";
};
