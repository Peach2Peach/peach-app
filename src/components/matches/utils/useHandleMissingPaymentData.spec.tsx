import { act, fireEvent, render, renderHook } from "test-utils";
import { pushMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import i18n from "../../../utils/i18n";
import { Toast } from "../../toast/Toast";
import { useHandleMissingPaymentData } from "./useHandleMissingPaymentData";

describe("handleMissingPaymentData", () => {
  const offer = { id: 1 } as unknown as BuyOffer | SellOffer;
  const currency = "EUR";
  const paymentMethod = "sepa";

  it("should update the toast", () => {
    const { result } = renderHook(useHandleMissingPaymentData);
    const { queryByText } = render(<Toast />);
    act(() => result.current(offer, currency, paymentMethod));

    expect(queryByText(i18n("PAYMENT_DATA_MISSING.text"))).toBeTruthy();
    expect(queryByText("re-enter your details")).toBeTruthy();
  });
  it("should close the toast when the callback is called", () => {
    const { result } = renderHook(useHandleMissingPaymentData);
    const { getByText, queryByText } = render(<Toast />);
    act(() => result.current(offer, currency, paymentMethod));
    act(() => fireEvent.press(getByText("re-enter your details")));

    expect(queryByText("re-enter your details")).toBeNull();

    expect(pushMock).toHaveBeenCalledWith("paymentMethodForm", {
      paymentData: {
        type: "sepa",
        label: "SEPA #1",
        currencies: ["EUR"],
        country: undefined,
      },
      origin: "search",
    });
  });
  it("should detect gift cards", () => {
    const { result } = renderHook(useHandleMissingPaymentData);
    const { getByText } = render(<Toast />);
    act(() => result.current(offer, currency, "giftCard.amazon.DE"));
    act(() => fireEvent.press(getByText("re-enter your details")));

    expect(pushMock).toHaveBeenCalledWith("paymentMethodForm", {
      paymentData: {
        label: "Amazon Gift Card (DE) #1",
        type: "giftCard.amazon.DE",
        currencies: ["EUR"],
        country: "DE",
      },
      origin: "search",
    });
  });
});
