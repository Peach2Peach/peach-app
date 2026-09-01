import { parseError } from "./parseError";

describe("parseError", () => {
  it("should parse an error", () => {
    expect(parseError(new Error("test"))).toBe("test");
    expect(parseError("test")).toBe("TEST");
    expect(parseError(1)).toBe("UNKNOWN_ERROR");
  });

  it("maps plain sentence server errors onto translatable keys", () => {
    expect(parseError("You are not allowed to sell")).toBe(
      "SELLING_NOT_ALLOWED",
    );
    expect(parseError(new Error("You already have an ongoing trade"))).toBe(
      "ONGOING_TRADE_EXISTS",
    );
  });
});
