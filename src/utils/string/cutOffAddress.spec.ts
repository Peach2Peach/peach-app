import { cutOffAddress } from "./cutOffAddress";

describe("cutOffAddress", () => {
  it("should return the same address if it is shorter than 15 characters", () => {
    expect(cutOffAddress("1234567890")).toBe("1234567890");
  });

  it("should return the address cut in the middle and replaced with ...", () => {
    expect(cutOffAddress("12345678901234567890")).toBe("12345678 ... 567890");
  });

  it("should handle empty string", () => {
    expect(cutOffAddress("")).toBe("");
  });
});
