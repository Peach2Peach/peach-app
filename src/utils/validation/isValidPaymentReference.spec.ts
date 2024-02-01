import { isValidPaymentReference } from "./isValidPaymentReference";

describe("isValidPaymentReference", () => {
  it('should return false if the reference contains the word "bitcoin"', () => {
    expect(isValidPaymentReference("for selling bitcoin")).toBeFalsy();
  });
  it('should return false if the reference contains the word "peach"', () => {
    expect(isValidPaymentReference("trade on peach")).toBeFalsy();
  });
  it("shouldn't care about the case of the reference", () => {
    expect(isValidPaymentReference("for selling BITCOIN")).toBeFalsy();
  });
});
