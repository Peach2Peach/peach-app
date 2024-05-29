import { isRUTValid } from "./isRUTValid";

describe("isRUTValid", () => {
  it("should return true for a valid RUT", () => {
    expect(isRUTValid("16820803-0")).toBe(true); // Correct and common test RUT
    expect(isRUTValid("13.804.924-8")).toBe(true); // Correct and common test RUT
  });

  it("should return false for an invalid RUT", () => {
    expect(isRUTValid("12345678-9")).toBe(false); // Invalid check digit
    expect(isRUTValid("12.345.678-K")).toBe(false); // Incorrect check digit
  });

  it("should return false for incorrect input formats", () => {
    expect(isRUTValid("")).toBe(false); // Empty string
    expect(isRUTValid("abcdefgh-k")).toBe(false); // Non-numeric body
  });
});
