import { isUPIId } from "./isUPIId";

describe("isUPI", () => {
  it("should return true for a valid UPI ID", () => {
    expect(isUPIId("user@bank")).toBe(true);
    expect(isUPIId("123.user@bank123")).toBe(true);
    expect(isUPIId("user.name@bank")).toBe(true);
  });

  it("should return false for an invalid UPI ID", () => {
    expect(isUPIId("justuser")).toBe(false);
    expect(isUPIId("user@")).toBe(false);
    expect(isUPIId("@bank")).toBe(false);
    expect(isUPIId("user@bank@something")).toBe(false);
    expect(isUPIId("user name@bank")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isUPIId("")).toBe(false);
  });
});
