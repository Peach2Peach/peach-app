import ShallowRenderer from "react-test-renderer/shallow";
import { tradingLimit } from "../../../../tests/unit/data/tradingLimitsData";
import { DailyTradingLimit } from "./DailyTradingLimit";

jest.mock("../../../hooks/query/useTradingLimits", () => ({
  useTradingLimits: () => tradingLimit,
}));

describe("DailyTradingLimit", () => {
  const renderer = ShallowRenderer.createRenderer();

  it("should render correctly", () => {
    renderer.render(<DailyTradingLimit />);

    const renderOutput = renderer.getRenderOutput();
    expect(renderOutput).toMatchSnapshot();
  });
});
