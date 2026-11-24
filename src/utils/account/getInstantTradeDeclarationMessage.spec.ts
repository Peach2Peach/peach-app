import { getInstantTradeDeclarationMessage } from "./getInstantTradeDeclarationMessage";

describe("getInstantTradeDeclarationMessage", () => {
  const userId =
    "02abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";
  it("declares an instant trade offer", () => {
    expect(getInstantTradeDeclarationMessage(userId, "47", true)).toBe(
      "I, user peach02abcdef, declare that the offer with id 47 is instant trade",
    );
  });
  it("declares a non instant trade offer", () => {
    expect(getInstantTradeDeclarationMessage(userId, "47", false)).toBe(
      "I, user peach02abcdef, declare that the offer with id 47 is NOT instant trade",
    );
  });
});
