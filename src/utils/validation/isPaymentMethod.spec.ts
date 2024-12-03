import { useConfigStore } from "../../store/configStore/configStore";
import { isPaymentMethod } from "./isPaymentMethod";

describe("isPaymentMethod", () => {
  beforeEach(() => {
    useConfigStore.getState().setPaymentMethods([
      {
        id: "sepa",
        anonymous: false,
        currencies: ["EUR", "CHF"],
        fields: { mandatory: [[["iban", "bic"]]], optional: ["reference"] },
      },
    ]);
  });
  it("returns true if string is a payment method", () => {
    expect(isPaymentMethod("sepa")).toBeTruthy();
  });
  it("returns false if string is not a payment method", () => {
    expect(isPaymentMethod("Steve")).toBeFalsy();
  });
});
