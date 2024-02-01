import { isNumber } from "./isNumber";

describe("isNumber", () => {
  it("validates numbers", () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(Infinity)).toBe(true);
    expect(!isNumber(null)).toBe(true);
    expect(!isNumber(undefined)).toBe(true);
    expect(!isNumber({})).toBe(true);
    expect(!isNumber([])).toBe(true);
    expect(!isNumber([1])).toBe(true);
    expect(!isNumber("CHF")).toBe(true);
  });
});
