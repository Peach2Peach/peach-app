import { fireEvent, render } from "test-utils";
import { wronglyFundedSellOffer } from "../../tests/unit/data/offerData";
import { navigateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { FundingAmountDifferentPopup } from "./FundingAmountDifferentPopup";

const mockClosePopup = jest.fn();
jest.mock("../components/popup/Popup", () => ({
  useClosePopup: () => mockClosePopup,
}));

describe("FundingAmountDifferentPopup", () => {
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
