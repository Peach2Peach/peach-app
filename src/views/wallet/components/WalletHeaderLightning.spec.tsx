import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { WalletHeaderLightning } from "./WalletHeaderLightning";

describe("WalletHeaderLightning", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<WalletHeaderLightning />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should go to transaction history", () => {
    const { getByAccessibilityHint } = render(<WalletHeaderLightning />);

    fireEvent.press(getByAccessibilityHint("go to transaction history"));
    expect(navigateMock).toHaveBeenCalledWith("transactionHistoryLightning");
  });
});
