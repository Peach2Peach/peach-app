import { isValidPerfectMoney } from "./isValidPerfectMoney";

describe("isValidPerfectMoney", () => {
  it("should return true for valid account numbers", () => {
    expect(isValidPerfectMoney("U12345678")).toBe(true);
    expect(isValidPerfectMoney("E12345678")).toBe(true);
    expect(isValidPerfectMoney("G12345678")).toBe(true);
  });

  it("should return false for invalid account numbers", () => {
    expect(isValidPerfectMoney("U1234567")).toBe(false);
    expect(isValidPerfectMoney("E123456789")).toBe(false);
    expect(isValidPerfectMoney("X12345678")).toBe(false);
    expect(isValidPerfectMoney("U1234567E")).toBe(false);
    expect(isValidPerfectMoney("Gabcdefgh")).toBe(false);
  });

  it("should return false for incorrect input formats", () => {
    expect(isValidPerfectMoney("")).toBe(false);
    expect(isValidPerfectMoney("U1234A678")).toBe(false);
  });
});
