import { shouldGoToFundEscrow } from "./shouldGoToFundEscrow";

describe("shouldGoToFundEscrow", () => {
  it("should return true for status that should lead to funding escrow", () => {
    expect(shouldGoToFundEscrow("fundEscrow")).toBe(true);
    expect(shouldGoToFundEscrow("escrowWaitingForConfirmation")).toBe(true);
  });
  it("should return false for status that should not lead to funding escrow", () => {
    expect(shouldGoToFundEscrow("dispute")).toBe(false);
    expect(shouldGoToFundEscrow("rateUser")).toBe(false);
    expect(shouldGoToFundEscrow("searchingForPeer")).toBe(false);
    expect(shouldGoToFundEscrow("hasMatchesAvailable")).toBe(false);
  });
});
