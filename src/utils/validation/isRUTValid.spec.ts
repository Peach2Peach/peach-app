import { isRUTValid } from "./isRUTValid";

describe("isRUTValid", () => {
  it("should return true for a valid RUT", () => {
    expect(isRUTValid("16820803-0")).toBe(true);
    expect(isRUTValid("13.804.924-8")).toBe(true);
  });

  it("should return false for an invalid RUT", () => {
    expect(isRUTValid("12345678-9")).toBe(false);
    expect(isRUTValid("12.345.678-K")).toBe(false);
  });

  it("should return false for incorrect input formats", () => {
    expect(isRUTValid("")).toBe(false);
    expect(isRUTValid("abcdefgh-k")).toBe(false);
  });
});
