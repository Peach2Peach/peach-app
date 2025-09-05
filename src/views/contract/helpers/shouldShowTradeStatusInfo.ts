import { isPaymentTooLate } from "../../../utils/contract/status/isPaymentTooLate";

export const shouldShowTradeStatusInfo = (
  contract: Pick<
    Contract,
    | "paymentMade"
    | "paymentExpectedBy"
    | "canceled"
    | "cancelationRequested"
    | "disputeWinner"
    | "tradeStatus"
  >,
  view: "buyer" | "seller",
) => {
  const { paymentMade, paymentExpectedBy, tradeStatus } = contract;
  const shouldShowPaymentTooLate =
    isPaymentTooLate({
      paymentMade,
      paymentExpectedBy,
    }) &&
    (tradeStatus === "paymentTooLate" || view === "buyer");
  return (
    shouldShowPaymentTooLate ||
    contract.canceled ||
    (contract.disputeWinner === "buyer" &&
      ["releaseEscrow", "confirmPaymentRequired"].includes(tradeStatus)) ||
    (contract.cancelationRequested && view === "buyer") ||
    tradeStatus === "fundingExpired"
  );
};
