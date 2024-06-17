import { getSellerDisputeStatusText } from "./getSellerDisputeStatusText";
import { tolgee } from "../../../tolgee";

describe("getSellerDisputeStatusText", () => {
  it("should return the correct text for a lost dispute", () => {
    const contract = {
      disputeWinner: "buyer",
      tradeStatus: "releaseEscrow",
    } as const;
    expect(getSellerDisputeStatusText(contract)).toBe(
      tolgee.t("contract.seller.disputeLost.releaseEscrow", { ns: "contract" }),
    );
  });
  it("should return the correct text for a lost dispute where the escrow has been released", () => {
    const contract = {
      disputeWinner: "buyer",
      tradeStatus: "tradeCompleted",
    } as const;
    expect(getSellerDisputeStatusText(contract)).toBe(
      tolgee.t("contract.seller.disputeLost.escrowReleased", {
        ns: "contract",
      }),
    );
  });
  it("should return the correct text for a won dispute where the seller can republish", () => {
    const contract = {
      disputeWinner: "seller",
      tradeStatus: "refundOrReviveRequired",
    } as const;
    expect(getSellerDisputeStatusText(contract)).toBe(
      tolgee.t("contract.seller.disputeWon.refundOrRepublish", {
        ns: "contract",
      }),
    );
  });
  it("should return the correct text for a won dispute where the seller cannot republish", () => {
    const contract = {
      disputeWinner: "seller",
      tradeStatus: "refundTxSignatureRequired",
    } as const;
    expect(getSellerDisputeStatusText(contract)).toBe(
      tolgee.t("contract.seller.disputeWon.refund", { ns: "contract" }),
    );
  });
});
