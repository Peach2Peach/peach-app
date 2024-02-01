import { shouldGoToContractChat } from "./shouldGoToContractChat";

describe("shouldGoToContractChat", () => {
  it("should return true if contractId is present and isChat is true", () => {
    const data = { contractId: "123", isChat: "true" };
    expect(shouldGoToContractChat(data)).toBe(true);
  });

  it("should return false if contractId is not present", () => {
    const data = { isChat: "true" };
    expect(shouldGoToContractChat(data)).toBe(false);
  });

  it("should return false if isChat is false", () => {
    const data = { contractId: "123", isChat: "false" };
    expect(shouldGoToContractChat(data)).toBe(false);
  });
});
