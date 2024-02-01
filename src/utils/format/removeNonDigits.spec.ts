import { removeNonDigits } from "./removeNonDigits";

describe("removeNonDigits", () => {
  it("should remove non-digits", () => {
    expect(removeNonDigits("abc1,2.3")).toBe("123");
  });
});
