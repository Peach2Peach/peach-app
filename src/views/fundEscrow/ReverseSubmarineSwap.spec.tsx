import { render } from "test-utils";
import { reverseSwapResponse, swapStatusCreated, swapStatusMempool } from "../../../tests/unit/data/boltzData";
import { liquidAddresses } from "../../../tests/unit/data/liquidNetworkData";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import { ReverseSubmarineSwap } from "./ReverseSubmarineSwap";

jest.mock("../../utils/boltz/query/usePostReverseSubmarineSwap");
const useClaimReverseSubmarineSwapMock = jest.requireMock("../../utils/boltz/query/usePostReverseSubmarineSwap").usePostReverseSubmarineSwap.mockReturnValue({
  data: {
    swapInfo: reverseSwapResponse,
    keyPairIndex: 0,
    keyPairWIF: 'cRUXxW6WysXYi7cAkP9LXevAAhWDoHJ8VRFdmxVhqm77jQZruT9Q',
    preimage: 'preimage',
  }
})
jest.mock("../../utils/boltz/query/useSwapStatus");
const useSwapStatusMock = jest.requireMock("../../utils/boltz/query/useSwapStatus").useSwapStatus.mockReturnValue({
  status: swapStatusCreated
})

jest.mock("./components/ClaimReverseSubmarineSwap", () => ({
  ClaimReverseSubmarineSwap: 'ClaimReverseSubmarineSwap'
}));

describe("ReverseSubmarineSwap", () => {
  const props = {
    offerId: '1',
    address: liquidAddresses.regtest[0],
    amount: 30000
  }
  
  it("should render correctly", () => {
    const { toJSON } = render(<ReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should save swap", () => {
    render(<ReverseSubmarineSwap {...props} />);
    expect(useBoltzSwapStore.getState().swaps[props.offerId]).toBeDefined()
  });
  it("should show loading when swap request is in process", () => {
    useClaimReverseSubmarineSwapMock.mockReturnValueOnce({data: undefined})
    const { toJSON } = render(<ReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should show error box if swap process failed", () => {
    useClaimReverseSubmarineSwapMock.mockReturnValueOnce({error: new Error('GENERAL_ERROR')})
    const { toJSON } = render(<ReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render ClaimReverseSubmarineSwap if status transaction.mempool", () => {
    useSwapStatusMock.mockReturnValueOnce({status: swapStatusMempool})
    const { toJSON } = render(<ReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
