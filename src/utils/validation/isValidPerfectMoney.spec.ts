import { isValidPerfectMoney } from "./isValidPerfectMoney";

describe("isValidPerfectMoney", () => {
  it("should return true for valid account numbers", () => {
    expect(isValidPerfectMoney("U12345678")).toBe(true); // Valid with 'U'
    expect(isValidPerfectMoney("E12345678")).toBe(true); // Valid with 'E'
    expect(isValidPerfectMoney("G12345678")).toBe(true); // Valid with 'G'
  });

  it("should return false for invalid account numbers", () => {
    expect(isValidPerfectMoney("U1234567")).toBe(false); // Too few digits
    expect(isValidPerfectMoney("E123456789")).toBe(false); // Too many digits
    expect(isValidPerfectMoney("X12345678")).toBe(false); // Invalid starting letter
    expect(isValidPerfectMoney("U1234567E")).toBe(false); // Ends with a non-digit
    expect(isValidPerfectMoney("Gabcdefgh")).toBe(false); // Non-digit characters
  });

  it("should return false for incorrect input formats", () => {
    expect(isValidPerfectMoney("")).toBe(false); // Empty string
    expect(isValidPerfectMoney("U1234A678")).toBe(false); // Contains non-numeric character
  });
});
