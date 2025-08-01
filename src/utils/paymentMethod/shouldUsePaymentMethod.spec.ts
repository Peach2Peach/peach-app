import { PaymentMethodInfo } from "../../../peach-api/src/@types/payment";
import { shouldUsePaymentMethod } from "./shouldUsePaymentMethod";

describe("shouldUsePaymentMethod", () => {
  const paymentCategories: PaymentCategories = {
    bankTransfer: ["sepa", "instantSepa", "fasterPayments"],
    onlineWallet: ["paypal", "revolut", "wise"],
    nationalOption: ["mbWay", "bizum", "satispay", "mobilePay"],
    giftCard: [],
    cash: [],
    global: ["liquid", "lnurl"],
  };
  it("returns true for a supported payment method", () => {
    const info: PaymentMethodInfo = {
      id: "sepa",
      currencies: ["EUR"],
      fields: {
        mandatory: [],
        optional: [],
      },
      anonymous: false,
    };
    expect(shouldUsePaymentMethod(paymentCategories)(info)).toBe(true);
  });
  it("returns true for a any cash trade", () => {
    const info: PaymentMethodInfo = {
      id: "cash.this-is-not-defined-in-the-categories-but-valid",
      fields: {
        mandatory: [],
        optional: [],
      },
      currencies: ["EUR"],
      rounded: true,
      anonymous: true,
    };
    expect(shouldUsePaymentMethod(paymentCategories)(info)).toBe(true);
  });
  it("returns false a payment method that has not been installed", () => {
    const info: PaymentMethodInfo = {
      // @ts-expect-error - shitcoins are not supported
      id: "etherium",
      currencies: ["EUR"],
      rounded: true,
      anonymous: true,
    };
    expect(shouldUsePaymentMethod(paymentCategories)(info)).toBe(false);
  });
});
