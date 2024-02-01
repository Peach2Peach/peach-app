import { compatibilityCheck } from "./compatibilityCheck";

describe("compatibilityCheck", () => {
  it("checks whether current version is compatible with minimum version", () => {
    expect(compatibilityCheck("0.0.1", "0.0.1")).toBeTruthy();
    expect(compatibilityCheck("0.0.1 (217)", "0.0.1 (217)")).toBeTruthy();
    expect(compatibilityCheck("0.0.1 (218)", "0.0.1 (217)")).toBeTruthy();
    expect(compatibilityCheck("0.0.2", "0.0.1")).toBeTruthy();
    expect(compatibilityCheck("0.1.0", "0.1.0")).toBeTruthy();
    expect(compatibilityCheck("1.0.0", "1.0.0")).toBeTruthy();
    expect(compatibilityCheck("1.0.1", "1.0.0")).toBeTruthy();
    expect(compatibilityCheck("0.0.1-rc.1", "0.0.1-rc.1")).toBeTruthy();
    expect(compatibilityCheck("0.0.1-rc.2", "0.0.1-rc.1")).toBeTruthy();
    expect(compatibilityCheck("0.1.4-82", "0.1.4-82")).toBeTruthy();
    expect(compatibilityCheck("0.1.4-83", "0.1.4-82")).toBeTruthy();
    expect(compatibilityCheck("0.1.10", "0.1.8")).toBeTruthy();
    expect(compatibilityCheck("1.0.1", "1.0.1 (217)")).toBeFalsy();
    expect(compatibilityCheck("1.0.1 (216)", "1.0.1 (217)")).toBeFalsy();
    expect(compatibilityCheck("1.0.1", "1.0.2")).toBeFalsy();
    expect(compatibilityCheck("0.0.3", "1.0.2")).toBeFalsy();
    expect(compatibilityCheck("0.0.2", "0.0.3")).toBeFalsy();
    expect(compatibilityCheck("0.0.1-rc.2", "0.0.1-rc.3")).toBeFalsy();
    expect(compatibilityCheck("1.0.1-rc.2", "1.0.2.rc-3")).toBeFalsy();
    expect(compatibilityCheck("0.0.3-rc.2", "1.0.2.rc-3")).toBeFalsy();
    expect(compatibilityCheck("0.0.2-rc.2", "0.0.3.rc-3")).toBeFalsy();
    expect(compatibilityCheck("0.1.4", "0.1.4-83")).toBeFalsy();
    expect(compatibilityCheck("0.1.4-82", "0.1.4-83")).toBeFalsy();
    expect(compatibilityCheck("0.1.8", "0.1.10")).toBeFalsy();
  });
});
