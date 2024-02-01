import { Linking } from "react-native";
import { createRenderer } from "react-test-renderer/shallow";
import { fireEvent, render } from "test-utils";
import { Link } from "./Link";

describe("Link", () => {
  const renderer = createRenderer();
  const openURLSpy = jest.spyOn(Linking, "openURL");
  const text = "text";
  const url = "http://peachbitcoin.com";

  it("should render correctly", () => {
    renderer.render(<Link text={text} url={url} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should open link", async () => {
    const { getByText } = render(<Link text={text} url={url} />);
    await fireEvent(getByText(text), "onPress");
    expect(openURLSpy).toHaveBeenCalledWith(url);
  });
});
