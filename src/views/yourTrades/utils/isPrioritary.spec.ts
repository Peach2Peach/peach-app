import { isPrioritary } from "./isPrioritary";

describe("isPrioritary", () => {
  it("should return true for status is prioritary", () => {
    expect(isPrioritary("releaseEscrow")).toBe(true);
    expect(isPrioritary("confirmCancelation")).toBe(true);
    expect(isPrioritary("refundAddressRequired")).toBe(true);
    expect(isPrioritary("refundTxSignatureRequired")).toBe(true);
    expect(isPrioritary("refundOrReviveRequired")).toBe(true);
  });
  it("should return false for status is not prioritary", () => {
    expect(isPrioritary("dispute")).toBe(false);
    expect(isPrioritary("fundingAmountDifferent")).toBe(false);
    expect(isPrioritary("offerCanceled")).toBe(false);
    expect(isPrioritary("paymentRequired")).toBe(false);
    expect(isPrioritary("confirmPaymentRequired")).toBe(false);
  });
});
