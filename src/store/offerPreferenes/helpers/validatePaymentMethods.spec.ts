import { setPaymentMethods } from "../../../paymentMethods";
import { validatePaymentMethods } from "./validatePaymentMethods";

describe("validatePaymentMethods", () => {
  const meansOfPayment: MeansOfPayment = {
    EUR: ["sepa", "revolut", "paypal"],
    CHF: ["revolut"],
  };
  const originalPaymentData: PaymentData[] = [
    {
      id: "sepa-1234",
      iban: "DE89370400440532013000",
      bic: "COBADEFFXXX",
      label: "SEPA",
      type: "sepa",
      currencies: ["EUR"],
    },
    {
      id: "revolut-1234",
      label: "Revolut",
      type: "revolut",
      currencies: ["EUR", "CHF"],
      email: "satoshi@nakamoto.com",
    },
  ];
  beforeAll(() => {
    setPaymentMethods([
      { id: "sepa", currencies: ["EUR"], anonymous: false },
      {
        id: "revolut",
        currencies: ["EUR", "CHF"],
        anonymous: false,
      },
      { id: "paypal", currencies: ["EUR"], anonymous: false },
    ]);
  });

  it("should return false if no means of payment have been configured", () => {
    expect(
      validatePaymentMethods({ meansOfPayment: {}, originalPaymentData }),
    ).toBe(false);
  });

  it("should return false if some payment data is invalid", () => {
    expect(
      validatePaymentMethods({
        meansOfPayment,
        originalPaymentData: [
          ...originalPaymentData,
          {
            id: "sepa-1234",
            label: "SEPA",
            type: "sepa",
            currencies: ["EUR", "CHF"],
          },
        ],
      }),
    ).toBe(false);
  });

  it("should return true if all payment data is valid", () => {
    expect(
      validatePaymentMethods({ meansOfPayment, originalPaymentData }),
    ).toBe(true);
  });
});
