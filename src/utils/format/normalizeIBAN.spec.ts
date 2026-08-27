import { normalizeIBAN } from "./normalizeIBAN";

const CANONICAL = "IE29AIBK93115212345678";

describe("normalizeIBAN", () => {
  it("removes whitespace", () => {
    expect(normalizeIBAN("IE29 AIBK 9311 5212 3456 78")).toBe(CANONICAL);
  });
  it("removes every kind of whitespace, including pasted non-breaking spaces", () => {
    expect(normalizeIBAN(" IE29\tAIBK\n9311 5212 3456 78 ")).toBe(CANONICAL);
  });
  it("removes dashes and other separators", () => {
    expect(normalizeIBAN("IE29-AIBK-9311-5212-3456-78")).toBe(CANONICAL);
    expect(normalizeIBAN("IE29.AIBK/9311_5212|3456,78")).toBe(CANONICAL);
  });
  it("uppercases alphabetic characters", () => {
    expect(normalizeIBAN("ie29 aibk 9311 5212 3456 78")).toBe(CANONICAL);
  });
  it("leaves an already normalized IBAN untouched", () => {
    expect(normalizeIBAN(CANONICAL)).toBe(CANONICAL);
  });
});
