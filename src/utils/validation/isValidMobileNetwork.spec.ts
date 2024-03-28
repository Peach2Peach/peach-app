import {isValidMobileNetwork} from "./isValidMobileNetwork";

describe("isValidMobileNetwork", () => {
  it("should return true for a valid mobile network", () => {
    expect(isValidMobileNetwork("vodacom")).toBe(true);
    expect(isValidMobileNetwork("mtn")).toBe(true);
  });

  it ("should return false for an invalid mobile network", () => {
    expect(isValidMobileNetwork("orange")).toBe(false);
    expect(isValidMobileNetwork("t-mobile")).toBe(false);
  });
});
