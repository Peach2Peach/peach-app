import { render } from "test-utils";
import { submarineSwapResponse } from "../../../../../tests/unit/data/boltzData";
import { createTestWallet } from "../../../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../../../utils/wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../../../utils/wallet/setWallet";
import { ClaimSubmarineSwap } from "./ClaimSubmarineSwap";

const startSwapOutMock = jest.fn()
jest.mock("./hooks/useStartSwapOut");
jest.requireMock("./hooks/useStartSwapOut").useStartSwapOut.mockReturnValue(startSwapOutMock)

const peachWallet = new PeachLiquidJSWallet({ wallet: createTestWallet() });
setLiquidWallet(peachWallet);

describe("ClaimSubmarineSwap", () => {
  const swapInfo = submarineSwapResponse
  const invoice = 'invoice'
  const keyPairWIF= 'cRUXxW6WysXYi7cAkP9LXevAAhWDoHJ8VRFdmxVhqm77jQZruT9Q'

  it("should render correctly", () => {
    const { toJSON } = render(<ClaimSubmarineSwap {...{ swapInfo, invoice, keyPairWIF }} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
