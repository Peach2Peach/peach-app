import { isValidPayeerNumber } from "./isValidPayeerNumber";

describe("isPayeerAccountValid", () => {
  it("should return true for a valid Payeer account number", () => {
    expect(isValidPayeerNumber("P1114221974")).toBe(true);
  });

  it("should return false for an invalid Payeer account number", () => {
    expect(isValidPayeerNumber("P12345678901")).toBe(false);
    expect(isValidPayeerNumber("P12345678")).toBe(false);
    expect(isValidPayeerNumber("1114221974")).toBe(false);
    expect(isValidPayeerNumber("PX114221974")).toBe(false);
    expect(isValidPayeerNumber("P12345678P")).toBe(false);
  });

  it("should return false for incorrect input formats", () => {
    expect(isValidPayeerNumber("")).toBe(false);
    expect(isValidPayeerNumber("P1234A6789")).toBe(false);
  });
});
