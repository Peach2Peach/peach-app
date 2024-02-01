import i18n from "../../../utils/i18n";
import { getSellerDisputeStatusText } from "./getSellerDisputeStatusText";

describe("getSellerDisputeStatusText", () => {
  it("should return the correct text for a lost dispute", () => {
    const contract = {
      disputeWinner: "buyer",
      tradeStatus: "releaseEscrow",
    } as const;
    expect(getSellerDisputeStatusText(contract)).toBe(
      i18n("contract.seller.disputeLost.releaseEscrow"),
    );
  });
  it("should return the correct text for a lost dispute where the escrow has been released", () => {
    const contract = {
      disputeWinner: "buyer",
      tradeStatus: "tradeCompleted",
    } as const;
    expect(getSellerDisputeStatusText(contract)).toBe(
      i18n("contract.seller.disputeLost.escrowReleased"),
    );
  });
  it("should return the correct text for a won dispute where the seller can republish", () => {
    const contract = {
      disputeWinner: "seller",
      tradeStatus: "refundOrReviveRequired",
    } as const;
    expect(getSellerDisputeStatusText(contract)).toBe(
      i18n("contract.seller.disputeWon.refundOrRepublish"),
    );
  });
  it("should return the correct text for a won dispute where the seller cannot republish", () => {
    const contract = {
      disputeWinner: "seller",
      tradeStatus: "refundTxSignatureRequired",
    } as const;
    expect(getSellerDisputeStatusText(contract)).toBe(
      i18n("contract.seller.disputeWon.refund"),
    );
  });
});
