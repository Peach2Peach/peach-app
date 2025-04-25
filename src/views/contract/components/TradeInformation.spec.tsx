import { createRenderer } from "react-test-renderer/shallow";
import { TradeInformation } from "./TradeInformation";

jest.mock("../context", () => ({
  useContractContext: () => ({
    contract: {},
    view: "buyer",
  }),
}));

jest.mock("../helpers/shouldShowTradeStatusInfo");
const shouldShowTradeStatusInfoMock = jest
  .requireMock("../helpers/shouldShowTradeStatusInfo")
  .shouldShowTradeStatusInfo.mockReturnValue(true);

describe("TradeInformation", () => {
  const renderer = createRenderer();
  it("renders correctly with TradeStatusInfo", () => {
    renderer.render(<TradeInformation />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders correctly if TradeStatusInfo should not be shown", () => {
    shouldShowTradeStatusInfoMock.mockReturnValueOnce(false);
    renderer.render(<TradeInformation />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
