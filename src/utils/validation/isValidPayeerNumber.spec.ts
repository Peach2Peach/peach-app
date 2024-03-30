import { isValidPayeerNumber } from "./isValidPayeerNumber";

describe("isPayeerAccountValid", () => {
  it("should return true for a valid Payeer account number", () => {
    expect(isValidPayeerNumber("P1114221974")).toBe(true); // Valid account
  });

  it("should return false for an invalid Payeer account number", () => {
    expect(isValidPayeerNumber("P12345678901")).toBe(false); // Too many digits
    expect(isValidPayeerNumber("P12345678")).toBe(false); // Too few digits
    expect(isValidPayeerNumber("1114221974")).toBe(false); // Missing leading 'P'
    expect(isValidPayeerNumber("PX114221974")).toBe(false); // Non-digit character
    expect(isValidPayeerNumber("P12345678P")).toBe(false); // Ends with a non-digit
  });

  it("should return false for incorrect input formats", () => {
    expect(isValidPayeerNumber("")).toBe(false); // Empty string
    expect(isValidPayeerNumber("P1234A6789")).toBe(false); // Contains non-numeric character
  });
});
