import { isEmailRequiredForDispute } from "./isEmailRequiredForDispute";

describe("isEmailRequiredForDispute", () => {
  it("returns true if email is required for dispute", () => {
    expect(isEmailRequiredForDispute("noPayment.buyer")).toBeTruthy();
    expect(isEmailRequiredForDispute("noPayment.seller")).toBeTruthy();
  });
  it("returns false if email is not required for dispute", () => {
    expect(isEmailRequiredForDispute("abusive")).toBeFalsy();
    expect(isEmailRequiredForDispute("other")).toBeFalsy();
    expect(isEmailRequiredForDispute("unresponsive.buyer")).toBeFalsy();
    expect(isEmailRequiredForDispute("unresponsive.seller")).toBeFalsy();
  });
});
