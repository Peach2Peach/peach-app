import i18n from "../../../utils/i18n";

export const getBuyerDisputeStatusText = ({
  disputeWinner,
  disputeOutcome,
  releaseTxId,
}: Pick<Contract, "disputeWinner" | "disputeOutcome" | "releaseTxId">) => {
  let finalText = "";

  if (disputeWinner === "seller") {
    finalText = finalText + i18n("contract.buyer.disputeLost");
  } else {
    finalText = finalText + i18n("contract.buyer.disputeWon");
  }

  if (disputeOutcome === "buyerWins") {
    finalText = finalText + i18n("contract.buyer.sellerReputationImpacted");
  } else if (disputeOutcome === "sellerWins") {
    finalText = finalText + i18n("contract.buyer.ownReputationImpacted");
  }

  if (disputeWinner === "seller") {
    return finalText + i18n("contract.buyer.disputeLost.sellerRefunded");
  }

  const isResolved = !!releaseTxId;
  return (
    finalText +
    i18n(
      isResolved
        ? "contract.buyer.disputeWon.paidOut"
        : "contract.buyer.disputeWon.awaitingPayout",
    )
  );
};
