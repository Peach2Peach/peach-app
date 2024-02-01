import { createRenderer } from "react-test-renderer/shallow";
import { TradeInformation } from "./TradeInformation";

jest.mock("../context", () => ({
  useContractContext: () => ({
    contract: {},
    view: "buyer",
  }),
}));

const shouldShowTradeStatusInfoMock = jest.fn(() => true);
jest.mock("../helpers/shouldShowTradeStatusInfo", () => ({
  shouldShowTradeStatusInfo: jest.fn((..._args: unknown[]) =>
    shouldShowTradeStatusInfoMock(),
  ),
}));

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
