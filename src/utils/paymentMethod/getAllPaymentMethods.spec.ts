import { getAllPaymentMethods } from "./getAllPaymentMethods";

describe("getAllPaymentMethods", () => {
  const paymentCategories: PaymentCategories = {
    bankTransfer: ["sepa", "instantSepa", "fasterPayments"],
    onlineWallet: ["paypal", "revolut", "wise"],
    nationalOption: ["mbWay", "bizum", "satispay", "mobilePay"],
    giftCard: [],
    cash: [],
    global: ["liquid", "lnurl"],
  };
  it("returns all payment methods", () => {
    expect(getAllPaymentMethods(paymentCategories)).toStrictEqual([
      "sepa",
      "instantSepa",
      "fasterPayments",
      "paypal",
      "revolut",
      "wise",
      "mbWay",
      "bizum",
      "satispay",
      "mobilePay",
      "liquid",
      "lnurl",
    ]);
  });
});
