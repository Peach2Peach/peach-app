import { isCanonicalIBAN } from "./isCanonicalIBAN";

describe("isCanonicalIBAN", () => {
  it("accepts an IBAN in canonical form", () => {
    expect(isCanonicalIBAN("IE29AIBK93115212345678")).toBe(true);
    expect(isCanonicalIBAN("DE89370400440532013000")).toBe(true);
    expect(isCanonicalIBAN("NO9386011117947")).toBe(true);
  });

  it("rejects anything that still carries separators", () => {
    expect(isCanonicalIBAN("IE29 AIBK 9311 5212 3456 78")).toBe(false);
    expect(isCanonicalIBAN("IE29-AIBK-9311-5212-3456-78")).toBe(false);
    expect(isCanonicalIBAN("IE29.AIBK.9311.5212.3456.78")).toBe(false);
    expect(isCanonicalIBAN("IE29 AIBK93115212345678")).toBe(false);
    expect(isCanonicalIBAN(" IE29AIBK93115212345678")).toBe(false);
  });

  it("rejects lowercase", () => {
    expect(isCanonicalIBAN("ie29aibk93115212345678")).toBe(false);
    expect(isCanonicalIBAN("IE29aibk93115212345678")).toBe(false);
  });

  it("rejects invalid check digits", () => {
    expect(isCanonicalIBAN("IE29AIBK93115212345679")).toBe(false);
    expect(isCanonicalIBAN("DE98370400440532013000")).toBe(false);
  });

  it("rejects a malformed structure", () => {
    expect(isCanonicalIBAN("I29AIBK93115212345678")).toBe(false);
    expect(isCanonicalIBAN("IEAAAIBK93115212345678")).toBe(false);
    expect(isCanonicalIBAN("NOTANIBAN")).toBe(false);
    expect(isCanonicalIBAN("")).toBe(false);
  });

  it("rejects an IBAN outside the 15 to 34 character range", () => {
    expect(isCanonicalIBAN("NO938601111794")).toBe(false);
    expect(isCanonicalIBAN(`RU0304452522540817810538091310419${"0"}`)).toBe(
      false,
    );
  });

  it("accepts every country code, including ones missing from the iban package", () => {
    // countries in the ISO 13616 registry that iban@0.0.14 does not know about
    const ibans = [
      "RU0304452522540817810538091310419",
      "OM810180000001299123456",
      "DJ2110002010010409943020008",
      "LY83002048000020100120361",
      "SD2129010501234001",
      "SO211000001001000100141",
      "NI45BAPR00000013000003558124",
      "YE15CBYE0001018861234567891234",
      "FK88SC123456789012",
      "MN121234123456789123",
    ];
    ibans.forEach((iban) => expect(isCanonicalIBAN(iban)).toBe(true));
  });
});
