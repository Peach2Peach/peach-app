import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../../../../tests/unit/helpers/NavigationWrapper";
import { UserId } from "./UserId";

describe("UserId", () => {
  const id = "userId";

  it("should render correctly", () => {
    const { toJSON } = render(<UserId id={id} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should go to user profile", () => {
    const { getByText } = render(<UserId id={id} />);
    fireEvent.press(getByText("PeachuserId"));
    expect(navigateMock).toHaveBeenCalledWith("publicProfile", { userId: id });
  });
});
