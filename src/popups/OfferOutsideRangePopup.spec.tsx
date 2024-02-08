import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { OfferOutsideRangePopup } from "./OfferOutsideRangePopup";

const mockClosePopup = jest.fn();
jest.mock("../components/popup/Popup", () => ({
  useClosePopup: () => mockClosePopup,
}));

describe("useOfferOutsideRangePopup", () => {
  const offerId = "37";

  it("closes popup", () => {
    const { getByText } = render(<OfferOutsideRangePopup offerId={offerId} />);
    fireEvent.press(getByText("close"));

    expect(mockClosePopup).toHaveBeenCalled();
  });
  it("navigates to offer", () => {
    const { getByText } = render(<OfferOutsideRangePopup offerId={offerId} />);
    fireEvent.press(getByText("go to offer"));

    expect(mockClosePopup).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("offer", { offerId });
  });
});
