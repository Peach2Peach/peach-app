import { isDniValid } from "./isDniValid";

describe("isDniValid", () => {
  it("should return true for a DNI with valid length", () => {
    expect(isDniValid("12345678")).toBe(true); // 8 digits, common historically
    expect(isDniValid("123456789")).toBe(true); // 9 digits, possible in newer DNIs
  });

  it("should return false for a DNI with invalid length", () => {
    expect(isDniValid("123456")).toBe(false); // Too short
    expect(isDniValid("1234567890")).toBe(false); // Too long
  });

  it("should return false for non-numeric input", () => {
    expect(isDniValid("ABCDEF")).toBe(false); // Non-numeric
    expect(isDniValid("1234A678")).toBe(false); // Contains non-numeric character
  });
});
