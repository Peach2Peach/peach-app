import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { HelpPopup } from "./HelpPopup";

const mockClosePopup = jest.fn();
jest.mock("../components/popup/GlobalPopup", () => ({
  useClosePopup: () => mockClosePopup,
}));

describe("HelpPopup", () => {
  it("should contain help text", () => {
    const { queryByText } = render(<HelpPopup id="acceptMatch" />);
    expect(queryByText("accept match = start trade")).toBeTruthy();
    expect(
      queryByText(
        "You can only match one buyer per offer. Once you've accepted a match, the trade is started.\n\nOnce started, you can only do a collaborative cancel with your buyer, or your reputation will be harmed.",
      ),
    ).toBeTruthy();
  });
  it("should navigate to report", () => {
    fireEvent.press(render(<HelpPopup id="acceptMatch" />).getByText("help"));
    expect(navigateMock).toHaveBeenCalledWith("report", {
      topic: "accept match = start trade",
      reason: "other",
    });
    expect(mockClosePopup).toHaveBeenCalled();
  });
});
