import { paymentMethodAllowedForCurrency } from "./paymentMethodAllowedForCurrency";

describe("paymentMethodAllowedForCurrency", () => {
  it("checks if payment method is allowed for a given rcurrency", () => {
    expect(paymentMethodAllowedForCurrency("sepa", "EUR")).toBe(true);
    expect(paymentMethodAllowedForCurrency("sepa", "CHF")).toBe(false);
    expect(paymentMethodAllowedForCurrency("sepa", "GBP")).toBe(false);
    expect(paymentMethodAllowedForCurrency("sepa", "SEK")).toBe(false);
  });
});
