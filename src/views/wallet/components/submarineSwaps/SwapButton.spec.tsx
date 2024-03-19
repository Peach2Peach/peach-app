import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { createTestWallet } from "../../../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../../../utils/wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../../../utils/wallet/useLiquidWalletState";
import { SwapButton } from "./SwapButton";
expect.extend({ toMatchDiffSnapshot });

const startSwapOutMock = jest.fn();
jest.mock("./hooks/useStartSwapOut");
jest
  .requireMock("./hooks/useStartSwapOut")
  .useStartSwapOut.mockReturnValue(startSwapOutMock);

const peachWallet = new PeachLiquidJSWallet({ wallet: createTestWallet() });
setLiquidWallet(peachWallet);

describe("SwapButton", () => {
  const { toJSON } = render(<SwapButton />);
  const base = toJSON();
  it("should render correctly", () => {
    expect(base).toMatchSnapshot();
  });
  it("should render correctly when wallet is synced", () => {
    useLiquidWalletState.getState().setIsSynced(true);
    expect(render(<SwapButton />).toJSON()).toMatchDiffSnapshot(base);
  });
  it("start swap out process when pressed on", () => {
    useLiquidWalletState.getState().setIsSynced(true);

    const { getByText } = render(<SwapButton />);
    fireEvent.press(getByText("swap"));
    expect(startSwapOutMock).toHaveBeenCalled();
  });
});
