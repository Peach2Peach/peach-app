import { isDniValid } from "./isDniValid";

describe("isDniValid", () => {
  it("should return true for a DNI with valid length", () => {
    expect(isDniValid("12345678")).toBe(true);
    expect(isDniValid("123456789")).toBe(true);
  });

  it("should return false for a DNI with invalid length", () => {
    expect(isDniValid("123456")).toBe(false);
    expect(isDniValid("1234567890")).toBe(false);
  });

  it("should return false for non-numeric input", () => {
    expect(isDniValid("ABCDEF")).toBe(false);
    expect(isDniValid("1234A678")).toBe(false);
  });
});
