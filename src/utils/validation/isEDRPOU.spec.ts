import { isEDRPOU } from "./isEDRPOU";

describe("isEDRPOU", () => {
  it("should return true for a valid EDRPOU code", () => {
    expect(isEDRPOU("12345678")).toBe(true);
  });

  it("should return false for an invalid EDRPOU code", () => {
    // Test for a code that is too short
    expect(isEDRPOU("1234567")).toBe(false);
    // Test for a code that is too long
    expect(isEDRPOU("123456789")).toBe(false);
    // Test for a code with non-digit characters
    expect(isEDRPOU("1234abcd")).toBe(false);
    // Test for a code with special characters
    expect(isEDRPOU("1234-678")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isEDRPOU("")).toBe(false);
  });
});
