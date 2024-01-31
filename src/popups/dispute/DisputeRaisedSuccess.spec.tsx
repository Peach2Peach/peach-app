import { fireEvent, render } from "test-utils";
import { DisputeRaisedSuccess } from "./DisputeRaisedSuccess";

const closePopupMock = jest.fn();
jest.mock("../../components/popup/Popup", () => ({
  useClosePopup: () => closePopupMock,
}));

describe("DisputeRaisedSuccess", () => {
  it("opens dispute raised success popup for buyer", () => {
    const { queryByText } = render(<DisputeRaisedSuccess view="buyer" />);
    expect(
      queryByText(
        "The seller and the mediator have been notified. Keep an eye on the chat!",
      ),
    ).toBeTruthy();
  });
  it("opens dispute raised success popup for seller", () => {
    const { queryByText } = render(<DisputeRaisedSuccess view="seller" />);
    expect(
      queryByText(
        "The buyer and the mediator have been notified. Keep an eye on the chat!",
      ),
    ).toBeTruthy();
  });
  it("closes popup", () => {
    const { getByText } = render(<DisputeRaisedSuccess view="seller" />);
    fireEvent.press(getByText("close"));
    expect(closePopupMock).toHaveBeenCalled();
  });
});
