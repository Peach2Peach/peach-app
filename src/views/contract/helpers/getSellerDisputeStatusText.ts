import i18n from "../../../utils/i18n";

export const getSellerDisputeStatusText = ({
  disputeWinner,
  tradeStatus,
}: Pick<Contract, "disputeWinner" | "tradeStatus">) => {
  if (disputeWinner === "buyer") {
    if (tradeStatus === "releaseEscrow") {
      return i18n("contract.seller.disputeLost.releaseEscrow");
    }
    return i18n("contract.seller.disputeLost.escrowReleased");
  }
  const isRepublishAvailable = tradeStatus === "refundOrReviveRequired";
  if (isRepublishAvailable) {
    return i18n("contract.seller.disputeWon.refundOrRepublish");
  }
  return i18n("contract.seller.disputeWon.refund");
};
