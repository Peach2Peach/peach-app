import { fireEvent, render } from "test-utils";
import { openInWallet } from "../../utils/bitcoin/openInWallet";
import { OpenWallet } from "./OpenWallet";

jest.mock("../../utils/bitcoin/openInWallet", () => ({
  openInWallet: jest.fn(),
}));

describe("OpenWallet", () => {
  const address = "address";

  it("should call openInWallet with address", () => {
    const { getByText } = render(<OpenWallet {...{ address }} />);
    const textElement = getByText("open external wallet app");
    fireEvent.press(textElement);
    expect(openInWallet).toHaveBeenCalledWith(`bitcoin:${address}`);
  });
  it("should call openInWallet without address", () => {
    const { getByText } = render(<OpenWallet />);
    const textElement = getByText("open external wallet app");
    fireEvent.press(textElement);
    expect(openInWallet).toHaveBeenCalledWith("bitcoin:");
  });

  it("should render correctly", () => {
    const { toJSON } = render(<OpenWallet />);
    expect(toJSON()).toMatchSnapshot();
  });
});
