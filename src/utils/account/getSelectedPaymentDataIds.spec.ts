import { getSelectedPaymentDataIds } from "./getSelectedPaymentDataIds";

jest.mock("../paymentMethod/getPaymentMethodInfo");
const getPaymentMethodInfoMock = jest.requireMock(
  "../paymentMethod/getPaymentMethodInfo",
).getPaymentMethodInfo;

describe("getSelectedPaymentDataIds", () => {
  it("should return an array of payment data ids", () => {
    const preferredPaymentMethods: Partial<Record<PaymentMethod, string>> = {
      sepa: "sepa-1",
      paypal: "paypal-1",
      revolut: "",
    };

    getPaymentMethodInfoMock.mockReturnValueOnce({});
    getPaymentMethodInfoMock.mockReturnValueOnce({});
    getPaymentMethodInfoMock.mockReturnValueOnce({});

    const result = getSelectedPaymentDataIds(preferredPaymentMethods);

    expect(getPaymentMethodInfoMock).toHaveBeenCalledTimes(
      Object.keys(preferredPaymentMethods).length,
    );
    expect(result).toEqual(["sepa-1", "paypal-1"]);
  });

  it("should return an empty array if there are no payment data ids", () => {
    const preferredPaymentMethods = {
      sepa: "",
      paypal: "",
    };

    const result = getSelectedPaymentDataIds(preferredPaymentMethods);

    expect(result).toEqual([]);
  });
});
