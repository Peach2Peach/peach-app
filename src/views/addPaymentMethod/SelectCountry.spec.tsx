import { fireEvent, render, waitFor } from "test-utils";
import { PaymentMethodInfo } from "../../../peach-api/src/@types/payment";
import {
  navigateMock,
  setRouteMock,
} from "../../../tests/unit/helpers/NavigationWrapper";
import { Button } from "../../components/buttons/Button";
import { setPaymentMethods } from "../../paymentMethods";
import { useConfigStore } from "../../store/configStore/configStore";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import { SelectCountry } from "./SelectCountry";

jest.useFakeTimers();
describe("SelectCountry", () => {
  beforeAll(() => {
    const paymentMethods: PaymentMethodInfo[] = [
      {
        id: "giftCard.amazon",
        currencies: ["EUR"],
        countries: ["DE", "IT", "ES", "FR"],
        fields: {
          mandatory: [[["email"]]],
          optional: [],
        },
        anonymous: true,
      },
    ];
    setPaymentMethods(paymentMethods);
    useConfigStore.getState().setPaymentMethods(paymentMethods);
    setRouteMock({
      name: "selectCountry",
      key: "selectCountry",
      params: {
        origin: "paymentMethods",
        selectedCurrency: "EUR",
      },
    });
  });

  it("should render correctly", () => {
    const { toJSON } = render(<SelectCountry />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("should go to payment method form", async () => {
    const { getByText } = render(<SelectCountry />);
    fireEvent.press(getByText("Germany"));
    fireEvent.press(getByText("next"));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("paymentMethodForm", {
        origin: "paymentMethods",
        paymentData: {
          type: "giftCard.amazon.DE",
          label: "Amazon Gift Card (DE)",
          currencies: ["EUR"],
          country: "DE",
        },
      });
    });
  });

  it("should go to payment method form with incremented label", () => {
    usePaymentDataStore.getState().addPaymentData({
      type: "giftCard.amazon.DE",
      label: "Amazon Gift Card (DE)",
      currencies: ["EUR"],
      country: "DE",
      id: "1",
    });
    const { getByText } = render(<SelectCountry />);
    fireEvent.press(getByText("Germany"));
    fireEvent.press(getByText("next"));

    expect(navigateMock).toHaveBeenCalledWith("paymentMethodForm", {
      origin: "paymentMethods",
      paymentData: {
        type: "giftCard.amazon.DE",
        label: "Amazon Gift Card (DE) #2",
        currencies: ["EUR"],
        country: "DE",
      },
    });
  });

  it("should not go to payment method form if no country is selected", () => {
    const { getByText, UNSAFE_getByType } = render(<SelectCountry />);
    fireEvent.press(getByText("next"));

    expect(navigateMock).not.toHaveBeenCalled();

    const nextButton = UNSAFE_getByType(Button);
    expect(nextButton.props.disabled).toBe(true);
    nextButton.props.onPress();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
