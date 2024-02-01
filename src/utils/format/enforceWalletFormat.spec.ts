import { enforceWalletFormat } from "./enforceWalletFormat";

describe("enforceWalletFormat", () => {
  it("should format text correctly with lowercase input", () => {
    const result = enforceWalletFormat("abcd efgh 1234 5");
    expect(result).toEqual("ABCDEFGH12345");
  });
  it("should format text correctly with uppercase input", () => {
    const result = enforceWalletFormat("ABCDEFGH12345");
    expect(result).toEqual("ABCDEFGH12345");
  });
  it("should format text correctly with extra spaces", () => {
    const result = enforceWalletFormat("ABCD   EFGH   1234  5");
    expect(result).toEqual("ABCDEFGH12345");
  });

  it("should format text correctly with a partial input", () => {
    const result = enforceWalletFormat("abcd");
    expect(result).toEqual("ABCD");
  });

  it("should format text correctly with a full input", () => {
    const result = enforceWalletFormat("ABCDEFGH12345÷¬∞¢#@");
    expect(result).toEqual("ABCDEFGH12345");
  });
});
