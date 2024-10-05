import { useConfigStore } from "../../store/configStore/configStore";
import { paymentMethodAllowedForCurrency } from "./paymentMethodAllowedForCurrency";

describe("paymentMethodAllowedForCurrency", () => {
  it("checks if payment method is allowed for a given rcurrency", () => {
    useConfigStore.getState().setPaymentMethods([
      {
        id: "sepa",
        currencies: ["EUR"],
        anonymous: false,
        fields: {
          mandatory: [[["iban"]]],
          optional: [],
        },
      },
    ]);
    expect(paymentMethodAllowedForCurrency("sepa", "EUR")).toBe(true);
    expect(paymentMethodAllowedForCurrency("sepa", "CHF")).toBe(false);
    expect(paymentMethodAllowedForCurrency("sepa", "GBP")).toBe(false);
    expect(paymentMethodAllowedForCurrency("sepa", "SEK")).toBe(false);
  });
});
