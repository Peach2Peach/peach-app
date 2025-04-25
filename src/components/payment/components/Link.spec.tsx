import { Linking } from "react-native";
import { fireEvent, render, waitFor } from "test-utils";
import { Link } from "./Link";

jest.useFakeTimers();
describe("Link", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);
  const text = "text";
  const url = "http://peachbitcoin.com";

  it("should open link", async () => {
    const { getByText } = render(<Link text={text} url={url} />);
    fireEvent(getByText(text), "onPress");
    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalledWith(url);
    });
  });
});
