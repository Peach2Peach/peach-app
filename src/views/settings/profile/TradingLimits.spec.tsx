import ShallowRenderer from "react-test-renderer/shallow";
import { tradingLimit } from "../../../../tests/unit/data/tradingLimitsData";
import { TradingLimits } from "./TradingLimits";

jest.mock("../../../hooks/query/useTradingLimits");
jest
  .requireMock("../../../hooks/query/useTradingLimits")
  .useTradingLimits.mockReturnValue(tradingLimit);

describe("TradingLimits", () => {
  const renderer = ShallowRenderer.createRenderer();

  it("should render correctly", () => {
    renderer.render(<TradingLimits />);

    const renderOutput = renderer.getRenderOutput();
    expect(renderOutput).toMatchSnapshot();
  });
});
