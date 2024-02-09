import { createRenderer } from "react-test-renderer/shallow";
import { paypalData } from "../../../../tests/unit/data/paymentData";
import tw from "../../../styles/tailwind";
import { PaymentDataKeyFacts } from "./PaymentDataKeyFacts";

describe("PaymentDataKeyFacts", () => {
  const paymentData2: PaymentData = {
    ...paypalData,
    currencies: ["EUR", "CHF", "GBP", "PLN"],
  };

  it("should render correctly", () => {
    const renderer = createRenderer();
    renderer.render(
      <PaymentDataKeyFacts paymentData={paypalData} style={tw`mt-4`} />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it("should render multiple currencies, if set", () => {
    const renderer = createRenderer();
    renderer.render(
      <PaymentDataKeyFacts paymentData={paymentData2} style={tw`mt-4`} />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
});
