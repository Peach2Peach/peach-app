import { render } from "test-utils";
import { WalletHeaderLiquid } from "./WalletHeaderLiquid";

describe("WalletHeaderLiquid", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<WalletHeaderLiquid />);
    expect(toJSON()).toMatchSnapshot();
  });
});
