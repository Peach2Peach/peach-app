import { compatibilityCheck } from "./compatibilityCheck";

describe("compatibilityCheck", () => {
  it("checks whether current version is compatible with minimum version", () => {
    expect(compatibilityCheck("0.0.1 (217)", "0.0.1 (217)")).toBeTruthy();
    expect(compatibilityCheck("0.0.1 (218)", "0.0.1 (217)")).toBeTruthy();
    expect(compatibilityCheck("1.0.1 (216)", "1.0.1 (217)")).toBeFalsy();
  });
  it("returns true if the version is compatible with the minimum version", () => {
    expect(compatibilityCheck("0.0.1", "0.0.1")).toBeTruthy();
  });
  it("returns false if the version is not compatible with the minimum version", () => {
    expect(compatibilityCheck("0.0.1", "0.0.2")).toBeFalsy();
    expect(compatibilityCheck("0.4.4 (241)", "0.4.5")).toBeFalsy();
  });
});
