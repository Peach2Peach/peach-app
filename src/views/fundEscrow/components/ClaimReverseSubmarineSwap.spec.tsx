import { render } from "test-utils";
import { reverseSwapResponse, swapStatusCreated, swapStatusMempool } from "../../../../tests/unit/data/boltzData";
import { liquidAddresses } from "../../../../tests/unit/data/liquidNetworkData";
import { omit } from "../../../utils/object/omit";
import { ClaimReverseSubmarineSwap } from "./ClaimReverseSubmarineSwap";

jest.mock("../../../hooks/useLiquidFeeRate");
jest.requireMock("../../../hooks/useLiquidFeeRate").useLiquidFeeRate.mockReturnValue(1)

jest.mock("../../../utils/boltz/query/useClaimReverseSubmarineSwap");
const useClaimReverseSubmarineSwapMock = jest.requireMock("../../../utils/boltz/query/useClaimReverseSubmarineSwap").useClaimReverseSubmarineSwap.mockReturnValue({
  handleClaimMessage: jest.fn()
})

describe("ClaimReverseSubmarineSwap", () => {
  const props = {
    swapInfo: reverseSwapResponse,
    offerId: '1',
    address: liquidAddresses.regtest[0],
    swapStatus: swapStatusMempool,
    keyPairWIF:'cRUXxW6WysXYi7cAkP9LXevAAhWDoHJ8VRFdmxVhqm77jQZruT9Q',
    preimage: 'preimage',
  }

  it("should render correctly", () => {
    const { toJSON } = render(<ClaimReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render error box if no lockup tx could be found", () => {
    const { toJSON } = render(<ClaimReverseSubmarineSwap { ...{ ...props, swapStatus: swapStatusCreated } } />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render error box if swapInfo is imcomplete", () => {
    const { toJSON } = render(<ClaimReverseSubmarineSwap { ...{ ...props, swapInfo: omit(reverseSwapResponse, 'swapTree') } } />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render error box if there is a claim error", () => {
    useClaimReverseSubmarineSwapMock.mockReturnValue({ error: 'error' })
    const { toJSON } = render(<ClaimReverseSubmarineSwap { ...props } />);
    expect(toJSON()).toMatchSnapshot();
  });
});
