import { enforceIBANFormat } from "./enforceIBANFormat";

describe("enforceIBANFormat", () => {
  it("formats an IBAN correctly", () => {
    expect(enforceIBANFormat("DE89370400440532013000")).toBe(
      "DE89 3704 0044 0532 0130 00",
    );
  });
  it("formats half an IBAN correctly", () => {
    expect(enforceIBANFormat("DE8937040")).toBe("DE89 3704 0");
  });

  it("does not care about invalid IBAN", () => {
    expect(enforceIBANFormat("not-an-iban")).toBe("NOTA NIBA N");
  });
});
