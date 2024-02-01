import { createRenderer } from "react-test-renderer/shallow";
import { fireEvent, render } from "test-utils";
import { setPaymentMethods } from "../../../../paymentMethods";
import { CurrencySelection } from "./CurrencySelection";

describe("CurrencySelection", () => {
  const renderer = createRenderer();
  const onToggle = jest.fn();

  setPaymentMethods([
    {
      id: "revolut",
      currencies: [
        "EUR",
        "CHF",
        "GBP",
        "BGN",
        "CZK",
        "DKK",
        "HUF",
        "ISK",
        "NOK",
        "PLN",
        "RON",
        "SEK",
      ],
      anonymous: false,
    },
  ]);
  it("should render correctly", () => {
    renderer.render(
      <CurrencySelection
        paymentMethod="revolut"
        selectedCurrencies={["EUR", "CHF"]}
        onToggle={onToggle}
      />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it("should toggle a selection correctly", () => {
    const { getByText } = render(
      <CurrencySelection
        paymentMethod="revolut"
        selectedCurrencies={["EUR", "CHF"]}
        onToggle={onToggle}
      />,
    );
    fireEvent(getByText("GBP"), "onPress");
    expect(onToggle).toHaveBeenCalledWith("GBP");
  });
});
