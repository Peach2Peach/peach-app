import { isDefined } from "./isDefined";

describe("isDefined", () => {
  it("should return true for defined values", () => {
    expect(isDefined("test")).toBe(true);
    expect(isDefined(1)).toBe(true);
    expect(isDefined({})).toBe(true);
    expect(isDefined([])).toBe(true);
    expect(isDefined(jest.fn())).toBe(true);
    expect(isDefined(null)).toBe(true);
  });
  it("should return true for undefined values", () => {
    expect(isDefined(undefined)).toBe(false);
  });
});
