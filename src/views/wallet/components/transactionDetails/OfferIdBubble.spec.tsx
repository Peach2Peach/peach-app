import { fireEvent, render } from "test-utils";
import { buyOfferSummary } from "../../../../../tests/unit/data/offerSummaryData";
import { OfferIdBubble } from "./OfferIdBubble";

const goToOffer = jest.fn();
jest.mock("../../../../hooks/useTradeNavigation");
const useNavigateToOfferOrContractMock = jest
  .requireMock("../../../../hooks/useTradeNavigation")
  .useTradeNavigation.mockReturnValue(goToOffer);

describe("OfferIdBubble", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<OfferIdBubble offer={buyOfferSummary} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("calls bump fees", () => {
    const { getByText } = render(<OfferIdBubble offer={buyOfferSummary} />);
    fireEvent.press(getByText("P‑1C8"));

    expect(useNavigateToOfferOrContractMock).toHaveBeenCalledWith(
      buyOfferSummary,
    );
    expect(goToOffer).toHaveBeenCalled();
  });
});
