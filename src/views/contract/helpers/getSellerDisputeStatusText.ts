import { tolgee } from "../../../tolgee";

export const getSellerDisputeStatusText = ({
  disputeWinner,
  tradeStatus,
}: Pick<Contract, "disputeWinner" | "tradeStatus">) => {
  if (disputeWinner === "buyer") {
    if (tradeStatus === "releaseEscrow") {
      return tolgee.t("contract.seller.disputeLost.releaseEscrow", {
        ns: "contract",
      });
    }
    return tolgee.t("contract.seller.disputeLost.escrowReleased", {
      ns: "contract",
    });
  }
  const isRepublishAvailable = tradeStatus === "refundOrReviveRequired";
  if (isRepublishAvailable) {
    return tolgee.t("contract.seller.disputeWon.refundOrRepublish", {
      ns: "contract",
    });
  }
  return tolgee.t("contract.seller.disputeWon.refund", { ns: "contract" });
};
