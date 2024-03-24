import { render } from "test-utils";
import { contract } from "../../peach-api/src/testData/contract";
import { TradeBreakdownPopup } from "./TradeBreakdownPopup";

describe("TradeBreakdownPopup", () => {
  it("render correctly", () => {
    const { toJSON } = render(<TradeBreakdownPopup contract={contract} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
