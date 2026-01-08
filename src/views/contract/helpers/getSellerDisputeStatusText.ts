import i18n from "../../../utils/i18n";

export const getSellerDisputeStatusText = ({
  disputeWinner,
  disputeOutcome,
  tradeStatus,
  releaseTransaction,
}: Pick<
  Contract,
  "disputeWinner" | "disputeOutcome" | "tradeStatus" | "releaseTransaction"
>) => {
  let finalText = "";

  if (disputeWinner === "buyer") {
    finalText = finalText + i18n("contract.seller.disputeLost");
  } else {
    finalText = finalText + i18n("contract.seller.disputeWon");
  }

  if (disputeOutcome === "buyerWins") {
    finalText = finalText + i18n("contract.seller.ownReputationImpacted");
  } else if (disputeOutcome === "sellerWins") {
    finalText = finalText + i18n("contract.seller.buyerReputationImpacted");
  }

  if (disputeWinner === "buyer") {
    if (tradeStatus === "releaseEscrow") {
      return finalText + i18n("contract.seller.disputeLost.releaseEscrow");
    }
    return finalText + i18n("contract.seller.disputeLost.escrowReleased");
  }
  const isRepublishAvailable = tradeStatus === "refundOrReviveRequired";
  if (isRepublishAvailable) {
    return finalText + i18n("contract.seller.disputeWon.refundOrRepublish");
  }

  if (releaseTransaction) {
    finalText =
      finalText + i18n("contract.seller.disputeWon.escrowReleasedNoRefund");
    return finalText;
  }

  return finalText + i18n("contract.seller.disputeWon.refund");
};
