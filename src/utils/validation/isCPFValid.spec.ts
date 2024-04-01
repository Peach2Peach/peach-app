import { isCPFValid } from "./isCPFValid";

describe("isCPFValid", () => {
  it("should return true for a valid CPF", () => {
    expect(isCPFValid("529.982.247-25")).toBe(true); // Formatted CPF
    expect(isCPFValid("52998224725")).toBe(true); // Unformatted CPF
  });

  it("should return false for an invalid CPF", () => {
    expect(isCPFValid("123.456.789-08")).toBe(false); // Invalid check digits
    expect(isCPFValid("111.111.111-11")).toBe(false); // Invalid sequence
    expect(isCPFValid("52998224726")).toBe(false); // Invalid last digit
  });

  it("should return false for incorrect input formats", () => {
    expect(isCPFValid("")).toBe(false); // Empty string
    expect(isCPFValid("123")).toBe(false); // Too short
    expect(isCPFValid("123456789012")).toBe(false); // Too long
  });
});
