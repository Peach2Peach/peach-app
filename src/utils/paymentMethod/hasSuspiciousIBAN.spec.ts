import { hasSuspiciousIBAN } from "./hasSuspiciousIBAN";

const CANONICAL = "IE29AIBK93115212345678";

describe("hasSuspiciousIBAN", () => {
  it("accepts a canonical, valid IBAN", () => {
    expect(hasSuspiciousIBAN({ iban: CANONICAL })).toBe(false);
  });
  it("flags an IBAN containing whitespace", () => {
    expect(hasSuspiciousIBAN({ iban: "IE29 AIBK 9311 5212 3456 78" })).toBe(
      true,
    );
  });
  it("flags an IBAN containing dashes", () => {
    expect(hasSuspiciousIBAN({ iban: "IE29-AIBK-9311-5212-3456-78" })).toBe(
      true,
    );
  });
  it("flags an IBAN containing lowercase letters", () => {
    expect(hasSuspiciousIBAN({ iban: CANONICAL.toLowerCase() })).toBe(true);
  });
  it("flags an IBAN with invalid check digits", () => {
    expect(hasSuspiciousIBAN({ iban: "IE29AIBK93115212345679" })).toBe(true);
  });
  it("flags something that is not an IBAN at all", () => {
    expect(hasSuspiciousIBAN({ iban: "NOTANIBAN" })).toBe(true);
  });
  it("does not flag payment data without an IBAN", () => {
    expect(hasSuspiciousIBAN({ phone: "+341234875987" })).toBe(false);
    expect(hasSuspiciousIBAN({})).toBe(false);
  });
});
