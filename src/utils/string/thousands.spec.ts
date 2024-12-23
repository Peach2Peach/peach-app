/* eslint-disable no-magic-numbers */
import { thousands } from "./thousands";

describe("thousands", () => {
  it("groups a number into thousands with non breaking space by default", () => {
    expect(thousands(1)).toBe("1");
    expect(thousands(12)).toBe("12");
    expect(thousands(123)).toBe("123");
    expect(thousands(1234)).toBe("1 234");
    expect(thousands(12345)).toBe("12 345");
    expect(thousands(123456)).toBe("123 456");
    expect(thousands(1234567)).toBe("1 234 567");
    expect(thousands(12345678)).toBe("12 345 678");
    expect(thousands(21000000)).toBe("21 000 000");
    expect(thousands(100000000)).toBe("100 000 000");
  });
  it("groups a number into thousands with specified delimter", () => {
    expect(thousands(1234, "-")).toBe("1-234");
    expect(thousands(100000000, " ")).toBe("100 000 000");
    expect(thousands(100000000, ",")).toBe("100,000,000");
  });
  it("groups decimals into thousands", () => {
    expect(thousands(20.1)).toBe("20.1");
    expect(thousands(1234.567)).toBe("1 234.567");
    expect(thousands(1234.567, "-")).toBe("1-234.567");
  });
});
