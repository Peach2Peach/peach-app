import { enforceNumberFormat } from "./enforceNumberFormat";

describe("enforceNumberFormat", () => {
  it("should not transform integers", () => {
    expect(enforceNumberFormat("1")).toBe("1");
    expect(enforceNumberFormat("203984")).toBe("203984");
    expect(enforceNumberFormat("-1")).toBe("-1");
  });
  it("should strip out non numeric characters", () => {
    expect(enforceNumberFormat("1a")).toBe("1");
    expect(enforceNumberFormat("20bd3984")).toBe("203984");
    expect(enforceNumberFormat("-1d/")).toBe("-1");
    expect(enforceNumberFormat("^-1a4d")).toBe("-14");
  });
  it("should convert , to .", () => {
    expect(enforceNumberFormat("1,4")).toBe("1.4");
    expect(enforceNumberFormat("-1,4")).toBe("-1.4");
    expect(enforceNumberFormat("6.15")).toBe("6.15");
  });
});
