import { shouldGoToSearch } from "./shouldGoToSearch";

describe("shouldGoToSearch", () => {
  it("should return true for search", () => {
    expect(shouldGoToSearch("searchingForPeer")).toBe(true);
    expect(shouldGoToSearch("hasMatchesAvailable")).toBe(true);
    expect(shouldGoToSearch("offerHidden")).toBe(true);
    expect(shouldGoToSearch("offerHiddenWithMatchesAvailable")).toBe(true);
  });
  it("should return false for other statuses", () => {
    expect(shouldGoToSearch("fundEscrow")).toBe(false);
    expect(shouldGoToSearch("escrowWaitingForConfirmation")).toBe(false);
    expect(shouldGoToSearch("offerCanceled")).toBe(false);
  });
});
