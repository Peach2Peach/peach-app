import { getMatchPrice } from "./getMatchPrice";

jest.mock("../../../utils/paymentMethod/getPaymentMethodInfo");
const getPaymentMethodInfoMock = jest.requireMock(
  "../../../utils/paymentMethod/getPaymentMethodInfo",
).getPaymentMethodInfo;

describe("getMatchPrice", () => {
  beforeEach(() => {
    getPaymentMethodInfoMock.mockClear();
  });

  it("should return the matched price if it exists and the match is matched", () => {
    const match = {
      matched: true,
      matchedPrice: 0,
      prices: {
        USD: 200,
      },
    };

    expect(getMatchPrice(match, undefined, "USD")).toEqual(0);
  });

  it("should return the price of the selected currency if the match is matched but the matched price is null", () => {
    const USD_PRICE = 200;
    const match = {
      matched: true,
      matchedPrice: null,
      prices: {
        USD: USD_PRICE,
      },
    };

    expect(getMatchPrice(match, undefined, "USD")).toEqual(USD_PRICE);
  });

  it("should get the payment method info if the selected payment method is defined", () => {
    const match = {
      matched: true,
      matchedPrice: 0,
      prices: {
        USD: 200,
      },
    };

    getMatchPrice(match, "paypal", "USD");

    expect(getPaymentMethodInfoMock).toHaveBeenCalledWith("paypal");
  });

  it("should return the price of the selected currency if the match is not matched", () => {
    const USD_PRICE = 200;
    const match = {
      matched: false,
      matchedPrice: 0,
      prices: {
        USD: USD_PRICE,
      },
    };

    expect(getMatchPrice(match, undefined, "USD")).toEqual(USD_PRICE);
  });

  it("should round the price if the payment method is rounded", () => {
    const USD_PRICE = 200.5;
    const roundedUSDPrice = Math.round(USD_PRICE);
    const match = {
      matched: false,
      matchedPrice: 0,
      prices: {
        USD: USD_PRICE,
      },
    };

    getPaymentMethodInfoMock.mockReturnValue({
      id: "paypal",
      rounded: true,
    });

    expect(getMatchPrice(match, "paypal", "USD")).toEqual(roundedUSDPrice);
  });

  it("should not round the price if the payment method is not rounded", () => {
    const USD_PRICE = 200.5;
    const match = {
      matched: false,
      matchedPrice: 0,
      prices: {
        USD: USD_PRICE,
      },
    };

    getPaymentMethodInfoMock.mockReturnValue({
      id: "paypal",
      rounded: false,
    });

    expect(getMatchPrice(match, "paypal", "USD")).toEqual(USD_PRICE);
  });

  it("should return 0 if the price is undefined and the payment method is rounded", () => {
    const match = {
      matched: false,
      matchedPrice: 10,
      prices: {},
    };

    getPaymentMethodInfoMock.mockReturnValueOnce({
      id: "paypal",
      rounded: true,
    });

    expect(getMatchPrice(match, "paypal", "USD")).toEqual(0);
  });

  it("should return 0 if the price is undefined and the payment method is not rounded", () => {
    const match = {
      matched: false,
      matchedPrice: 10,
      prices: {},
    };

    getPaymentMethodInfoMock.mockReturnValueOnce({
      id: "paypal",
      rounded: false,
    });

    expect(getMatchPrice(match, "paypal", "USD")).toEqual(0);
  });
});
