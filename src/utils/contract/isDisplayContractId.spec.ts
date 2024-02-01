import { isDisplayContractId } from "./isDisplayContractId";

describe("isDisplayContractId", () => {
  it("should return true if the id starts with PC‑", () => {
    expect(isDisplayContractId("PC‑123‑456")).toBeTruthy();
  });

  it("should return false if the id does not start with PC‑", () => {
    expect(isDisplayContractId("P‑123")).toBeFalsy();
  });
});
