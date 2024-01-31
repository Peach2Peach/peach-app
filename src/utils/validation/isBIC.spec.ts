import { isBIC } from "./isBIC";

describe("isBIC", () => {
  it("should return true for a valid BIC", () => {
    expect(isBIC("ABCD DEFG HIJ")).toBe(true);
  });

  it("should return false for a BIC that contains lowercase letters", () => {
    expect(isBIC("abcd defg hij")).toBe(false);
  });

  it("should return false for a BIC that contains non-alphanumeric characters", () => {
    expect(isBIC("ABCD DEFG HI&")).toBe(false);
  });

  it("should return false for a BIC that is too long", () => {
    expect(isBIC("ABCD DEFG HIJK LMNO PQR")).toBe(false);
  });

  it("should return false for a BIC that is too short", () => {
    expect(isBIC("ABC DEF")).toBe(false);
  });

  it("should return true for a valid BIC without optional branch code", () => {
    expect(isBIC("AAAA BB CC")).toBe(true);
  });

  it("should return true for a valid BIC with optional branch code", () => {
    expect(isBIC("AAAA BB CC 123")).toBe(true);
  });
});
