import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { BuyOfferExpiredPopup } from "./BuyOfferExpiredPopup";

const mockClosePopup = jest.fn();
jest.mock("../components/popup/GlobalPopup", () => ({
  useClosePopup: () => mockClosePopup,
}));
describe("useBuyOfferExpiredPopup", () => {
  it("should navigate to contact", () => {
    const { getByText } = render(
      <BuyOfferExpiredPopup offerId="37" days="30" />,
    );
    fireEvent.press(getByText("help"));

    expect(navigateMock).toHaveBeenCalledWith("contact");
    expect(mockClosePopup).toHaveBeenCalled();
  });
});
