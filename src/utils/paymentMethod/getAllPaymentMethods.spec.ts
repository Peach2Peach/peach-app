import { getAllPaymentMethods } from "./getAllPaymentMethods";

describe("getAllPaymentMethods", () => { // Seems deprecated
  const paymentCategories: PaymentCategories = {
    bankTransfer: ["sepa", "instantSepa", "fasterPayments"],
    onlineWallet: ["paypal", "revolut", "wise"],
    nationalOption: ["mbWay", "bizum", "satispay", "mobilePay"],
    mobileMoney: [],
    giftCard: [],
    cash: [],
    other: ["liquid", "lnurl"],
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
