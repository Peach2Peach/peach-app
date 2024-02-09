import { isPaymentMethod } from "./isPaymentMethod";

describe("isPaymentMethod", () => {
  it("returns true if string is a payment method", () => {
    expect(isPaymentMethod("sepa")).toBeTruthy();
  });
  it("returns false if string is not a payment method", () => {
    expect(isPaymentMethod("Steve")).toBeFalsy();
  });
});
