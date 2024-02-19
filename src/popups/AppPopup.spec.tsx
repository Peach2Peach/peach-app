import { fireEvent, render } from "test-utils";
import { GlobalPopup } from "../components/popup/GlobalPopup";
import { AppPopup } from "./AppPopup";

describe("AppPopup", () => {
  it("should close the popup", () => {
    const { getByText } = render(<AppPopup id="matchUndone" />);
    fireEvent.press(getByText("close"));
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("match undone")).toBeFalsy();
  });
});
