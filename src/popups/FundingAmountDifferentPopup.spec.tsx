import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { wronglyFundedSellOffer } from "../../tests/unit/data/offerData";
import { navigateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { FundingAmountDifferentPopup } from "./FundingAmountDifferentPopup";
expect.extend({ toMatchDiffSnapshot });

const mockClosePopup = jest.fn();
jest.mock("../components/popup/GlobalPopup", () => ({
  useClosePopup: () => mockClosePopup,
}));

describe("FundingAmountDifferentPopup", () => {
  const base = render(
    <FundingAmountDifferentPopup sellOffer={wronglyFundedSellOffer} />,
  ).toJSON();
  it("renders correctly", () => {
    expect(base).toMatchSnapshot();
  });
  it("renders correctly for liquid offers", () => {
    const { toJSON } = render(
      <FundingAmountDifferentPopup
        sellOffer={{
          ...wronglyFundedSellOffer,
          fundingLiquid: wronglyFundedSellOffer.funding,
        }}
      />,
    );
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("navigates to wrongFundingAmount", () => {
    const { getByText } = render(
      <FundingAmountDifferentPopup sellOffer={wronglyFundedSellOffer} />,
    );
    fireEvent.press(getByText("go to trade"));

    expect(mockClosePopup).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("wrongFundingAmount", {
      offerId: wronglyFundedSellOffer.id,
    });
  });
});
