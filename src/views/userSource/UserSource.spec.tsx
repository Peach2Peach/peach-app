import { fireEvent, render, waitFor } from "test-utils";
import { peachAPI } from "../../utils/peachAPI";
import { UserSource } from "./UserSource";

jest.useFakeTimers();

describe("UserSource", () => {
  it("renders correctly", () => {
    expect(render(<UserSource />)).toMatchSnapshot();
  });
  it("submits the user source on button click", async () => {
    const submitSourceSpy = jest.spyOn(
      peachAPI.private.user,
      "submitUserSource",
    );
    const { getByText } = render(<UserSource />);
    const button = getByText("Twitter");
    fireEvent.press(button);

    await waitFor(() => {
      expect(submitSourceSpy).toHaveBeenCalledWith({ source: "twitter" });
    });
  });
});
