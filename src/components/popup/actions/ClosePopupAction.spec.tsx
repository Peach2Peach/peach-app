import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { ClosePopupAction } from "./ClosePopupAction";
expect.extend({ toMatchDiffSnapshot });

const closePopupMock = jest.fn();
jest.mock("../Popup");
jest.requireMock("../Popup").useClosePopup.mockReturnValue(closePopupMock);

describe("ClosePopupAction", () => {
  it("should call closePopup when pressed", () => {
    const { getByText } = render(<ClosePopupAction />);
    fireEvent.press(getByText("close"));
    expect(closePopupMock).toHaveBeenCalled();
  });
  it("should render correctly", () => {
    const { toJSON } = render(<ClosePopupAction />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly with custom text style", () => {
    const { toJSON } = render(
      <ClosePopupAction textStyle={{ color: "red" }} />,
    );
    expect(render(<ClosePopupAction />).toJSON()).toMatchDiffSnapshot(toJSON());
  });
});
