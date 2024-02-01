import ShallowRenderer from "react-test-renderer/shallow";
import { TradingLimitAmount } from "./TradingLimitAmount";

describe("TradingLimitAmount", () => {
  const renderer = ShallowRenderer.createRenderer();

  it("should render correctly for daily", () => {
    renderer.render(
      <TradingLimitAmount
        amount={10}
        limit={100}
        displayCurrency="EUR"
        type="daily"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly for monthly", () => {
    renderer.render(
      <TradingLimitAmount
        amount={100}
        limit={1000}
        displayCurrency="EUR"
        type="monthly"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly for yearly", () => {
    renderer.render(
      <TradingLimitAmount
        amount={1000}
        limit={10000}
        displayCurrency="EUR"
        type="yearly"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with infinite limit", () => {
    renderer.render(
      <TradingLimitAmount
        amount={1000}
        limit={Infinity}
        displayCurrency="EUR"
        type="yearly"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
