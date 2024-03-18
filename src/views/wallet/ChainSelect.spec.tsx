import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { ChainSelect } from "./ChainSelect";
expect.extend({ toMatchDiffSnapshot });

describe("ChainSelect", () => {
  const base = render(<ChainSelect current="bitcoin" />).toJSON();

  it("should render correctly when bitcoin is selected", () => {
    expect(base).toMatchSnapshot();
  });
  it("should render correctly when liquid is selected", () => {
    const { toJSON } = render(<ChainSelect current="liquid" />);
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("should render correctly when lightning is selected", () => {
    const { toJSON } = render(<ChainSelect current="lightning" />);
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("should should navigate to each wallet type", () => {
    const { getByText, rerender } = render(<ChainSelect current="lightning" />);
    fireEvent.press(getByText("wallet.wallet.bitcoin"));
    expect(navigateMock).toHaveBeenCalledWith("homeScreen", {
      screen: "wallet",
    });
    rerender(<ChainSelect current="bitcoin" />);
    fireEvent.press(getByText("wallet.wallet.lightning"));
    expect(navigateMock).toHaveBeenCalledWith("homeScreen", {
      screen: "lightningWallet",
    });
    rerender(<ChainSelect current="lightning" />);
    fireEvent.press(getByText("wallet.wallet.liquid"));
    expect(navigateMock).toHaveBeenCalledWith("homeScreen", {
      screen: "liquidWallet",
    });
  });
});
