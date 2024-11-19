import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { WalletHeader } from "./WalletHeader";

describe("WalletHeader", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<WalletHeader />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should go to transaction history", () => {
    const { getByAccessibilityHint } = render(<WalletHeader />);

    fireEvent.press(getByAccessibilityHint("go to transaction history"));
    expect(navigateMock).toHaveBeenCalledWith("transactionHistory");
  });
  it("should go to address checker", () => {
    const { getByAccessibilityHint } = render(<WalletHeader />);

    fireEvent.press(getByAccessibilityHint("go to Address checker"));
    expect(navigateMock).toHaveBeenCalledWith("addressChecker");
  });
});
