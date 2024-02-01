import { shouldGoToWrongFundingAmount } from "./shouldGoToWrongFundingAmount";

describe("shouldGoToWrongFundingAmount", () => {
  it("should return true for wrong funding amount", () => {
    expect(shouldGoToWrongFundingAmount("fundingAmountDifferent")).toBe(true);
  });
  it("should return false for other statuses", () => {
    expect(shouldGoToWrongFundingAmount("fundEscrow")).toBe(false);
    expect(shouldGoToWrongFundingAmount("escrowWaitingForConfirmation")).toBe(
      false,
    );
    expect(shouldGoToWrongFundingAmount("offerCanceled")).toBe(false);
  });
});
