import { isCPFValid } from "./isCPFValid";

describe("isCPFValid", () => {
  it("should return true for a valid CPF", () => {
    expect(isCPFValid("529.982.247-25")).toBe(true);
    expect(isCPFValid("52998224725")).toBe(true);
  });

  it("should return false for an invalid CPF", () => {
    expect(isCPFValid("123.456.789-08")).toBe(false);
    expect(isCPFValid("111.111.111-11")).toBe(false);
    expect(isCPFValid("52998224726")).toBe(false);
  });

  it("should return false for incorrect input formats", () => {
    expect(isCPFValid("")).toBe(false);
    expect(isCPFValid("123")).toBe(false);
    expect(isCPFValid("123456789012")).toBe(false);
  });
});
