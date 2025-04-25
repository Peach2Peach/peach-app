import { Linking } from "react-native";
import { fireEvent, render } from "test-utils";
import { Link } from "./Link";

describe("Link", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");
  const text = "text";
  const url = "http://peachbitcoin.com";

  it("should open link", async () => {
    const { getByText } = render(<Link text={text} url={url} />);
    await fireEvent(getByText(text), "onPress");
    expect(openURLSpy).toHaveBeenCalledWith(url);
  });
});
