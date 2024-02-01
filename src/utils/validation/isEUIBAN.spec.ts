import { isEUIBAN } from "./isEUIBAN";

describe("isEUIBAN", () => {
  test("returns true for a valid EU IBAN", () => {
    expect(isEUIBAN("FR1420041010050500013M02606")).toBe(true);
  });

  test("returns false for a non-EU IBAN", () => {
    expect(isEUIBAN("IR861234568790123456789012")).toBe(false);
  });

  test("returns false for an invalid IBAN", () => {
    expect(isEUIBAN("INVALID_IBAN")).toBe(false);
    expect(isEUIBAN("HU4211773016111110180000000")).toBe(false);
  });
});
