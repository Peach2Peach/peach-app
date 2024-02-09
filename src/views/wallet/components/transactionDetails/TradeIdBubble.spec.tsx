import { fireEvent, render } from "test-utils";
import { contractSummary } from "../../../../../tests/unit/data/contractSummaryData";
import { TradeIdBubble } from "./TradeIdBubble";

const goToContract = jest.fn();
jest.mock("../../../../hooks/useTradeNavigation");
const useNavigateToOfferOrContractMock = jest
  .requireMock("../../../../hooks/useTradeNavigation")
  .useTradeNavigation.mockReturnValue(goToContract);

describe("TradeIdBubble", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<TradeIdBubble trade={contractSummary} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("calls bump fees", () => {
    const { getByText } = render(<TradeIdBubble trade={contractSummary} />);
    fireEvent.press(getByText("PC‑7B‑1C8"));

    expect(useNavigateToOfferOrContractMock).toHaveBeenCalledWith(
      contractSummary,
    );
    expect(goToContract).toHaveBeenCalled();
  });
});
