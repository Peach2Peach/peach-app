import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { OfferOutsideRangePopup } from "./OfferOutsideRangePopup";

const closePopupMock = jest.fn();
jest.mock("../components/popup/Popup", () => ({
  useClosePopup: () => closePopupMock,
}));

describe("useOfferOutsideRangePopup", () => {
  const offerId = "37";

  it("closes popup", () => {
    const { getByText } = render(<OfferOutsideRangePopup offerId={offerId} />);
    fireEvent.press(getByText("close"));

    expect(closePopupMock).toHaveBeenCalled();
  });
  it("navigates to offer", () => {
    const { getByText } = render(<OfferOutsideRangePopup offerId={offerId} />);
    fireEvent.press(getByText("go to offer"));

    expect(closePopupMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("offer", { offerId });
  });
});
