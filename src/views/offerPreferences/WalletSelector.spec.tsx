import { ReactTestRendererJSON } from "react-test-renderer";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { WalletSelector } from "./WalletSelector";
expect.extend({ toMatchDiffSnapshot });

describe("WalletSelector", () => {
  const onPeachWalletPress = jest.fn();
  const onExternalWalletPress = jest.fn();
  const baseProps = {
    title: "title",
    bubbleColor: "orange",
    peachWalletActive: true,
    address: "address",
    addressLabel: "addressLabel",
    onPeachWalletPress,
    onExternalWalletPress,
    showExternalWallet: true,
    isPeachLiquidWallet: false,
  } as const;
  let base: ReactTestRendererJSON | ReactTestRendererJSON[] | null;

  it("should render correctly", () => {
    const { toJSON } = render(<WalletSelector {...baseProps} />);
    base = toJSON();
    expect(base).toMatchSnapshot();
  });
  it("should render correctly for liquid", () => {
    const { toJSON } = render(
      <WalletSelector
        {...{ ...baseProps, bubbleColor: "liquid", isPeachLiquidWallet: true }}
      />,
    );
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("should render correctly if peach wallet is not active", () => {
    const { toJSON } = render(
      <WalletSelector {...{ ...baseProps, peachWalletActive: false }} />,
    );
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("should render correctly if external wallet is not configured", () => {
    const { toJSON } = render(
      <WalletSelector
        {...{ ...baseProps, address: undefined, addressLabel: undefined }}
      />,
    );
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("should hide external wallet if showExternalWallet is set to false", () => {
    const { toJSON } = render(
      <WalletSelector {...{ ...baseProps, showExternalWallet: false }} />,
    );
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("should call callback when pressing on peach wallet", () => {
    const { getByText } = render(
      <WalletSelector {...{ ...baseProps, peachWalletActive: false }} />,
    );
    fireEvent.press(getByText("Peach wallet"));
    expect(onPeachWalletPress).toHaveBeenCalled();
  });
  it("should call callback when pressing on external wallet", () => {
    const { getByText } = render(<WalletSelector {...baseProps} />);
    fireEvent.press(getByText(baseProps.addressLabel));
    expect(onExternalWalletPress).toHaveBeenCalled();
  });
});
