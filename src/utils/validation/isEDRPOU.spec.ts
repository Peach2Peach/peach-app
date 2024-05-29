import { isEDRPOU } from "./isEDRPOU";

describe("isEDRPOU", () => {
  it("should return true for a valid EDRPOU code", () => {
    expect(isEDRPOU("12345678")).toBe(true);
  });

  it("should return false for an invalid EDRPOU code", () => {
    expect(isEDRPOU("1234567")).toBe(false);
    expect(isEDRPOU("123456789")).toBe(false);
    expect(isEDRPOU("1234abcd")).toBe(false);
    expect(isEDRPOU("1234-678")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isEDRPOU("")).toBe(false);
  });
});
