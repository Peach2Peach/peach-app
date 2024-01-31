import { isError } from "./isError";

describe("isError", () => {
  it("should return true for error status", () => {
    expect(isError("refundAddressRequired")).toBe(true);
    expect(isError("dispute")).toBe(true);
  });
  it("should return false for other statuses", () => {
    expect(isError("fundEscrow")).toBe(false);
    expect(isError("escrowWaitingForConfirmation")).toBe(false);
    expect(isError("searchingForPeer")).toBe(false);
    expect(isError("hasMatchesAvailable")).toBe(false);
  });
});
