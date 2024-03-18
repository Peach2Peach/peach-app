import bolt11 from "bolt11";
import { fireEvent, render, waitFor } from "test-utils";
import {
  reverseSwapResponse,
  swapStatusCreated,
  swapStatusMempool,
} from "../../../tests/unit/data/boltzData";
import {
  lnPayment,
  nodeInfo,
} from "../../../tests/unit/data/lightningNetworkData";
import { liquidAddresses } from "../../../tests/unit/data/liquidNetworkData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { SATSINBTC } from "../../constants";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import { MSAT_PER_SAT } from "../wallet/hooks/useLightningWalletBalance";
import { ReverseSubmarineSwap } from "./ReverseSubmarineSwap";

jest.mock("@breeztech/react-native-breez-sdk");
const nodeInfoMock = jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .nodeInfo.mockResolvedValue(nodeInfo);

const payInvoiceMock = jest.fn().mockResolvedValue(lnPayment);
jest.mock("../wallet/hooks/usePayInvoice");
const usePayInvoiceMock = jest
  .requireMock("../wallet/hooks/usePayInvoice")
  .usePayInvoice.mockReturnValue({
    payInvoice: payInvoiceMock,
    isPayingInvoice: false,
  });
jest.mock("../../utils/boltz/query/usePostReverseSubmarineSwap");
const useClaimReverseSubmarineSwapMock = jest
  .requireMock("../../utils/boltz/query/usePostReverseSubmarineSwap")
  .usePostReverseSubmarineSwap.mockReturnValue({
    data: {
      swapInfo: reverseSwapResponse,
      keyPairIndex: 0,
      keyPairWIF: "cRUXxW6WysXYi7cAkP9LXevAAhWDoHJ8VRFdmxVhqm77jQZruT9Q",
      preimage: "preimage",
    },
  });
jest.mock("../../utils/boltz/query/useSwapStatus");
const useSwapStatusMock = jest
  .requireMock("../../utils/boltz/query/useSwapStatus")
  .useSwapStatus.mockReturnValue({
    status: swapStatusCreated,
  });

jest.mock("./components/ClaimReverseSubmarineSwap", () => ({
  ClaimReverseSubmarineSwap: "ClaimReverseSubmarineSwap",
}));

describe("ReverseSubmarineSwap", () => {
  const props = {
    offerId: "1",
    address: liquidAddresses.regtest[0],
    amount: 0.0003,
  };

  afterEach(() => {
    queryClient.clear();
  });
  it("should render correctly", () => {
    const { toJSON } = render(<ReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should disable fund from peach wallet button when not enough balance", async () => {
    nodeInfoMock.mockReturnValueOnce({
      ...nodeInfo,
      channelsBalanceMsat: 0,
    });
    const { getByText } = render(
      <ReverseSubmarineSwap
        {...{
          ...props,
          amount: (nodeInfo.channelsBalanceMsat / MSAT_PER_SAT + 1) / SATSINBTC,
        }}
      />,
    );
    expect(
      getByText("fund from Peach wallet").parent?.parent?.parent?.props
        .accessibilityState.disabled,
    ).toBeTruthy();
  });
  it("should save swap", () => {
    render(<ReverseSubmarineSwap {...props} />);
    expect(
      useBoltzSwapStore.getState().swaps[reverseSwapResponse.id],
    ).toBeDefined();
  });
  it("should show loading when swap request is in process", () => {
    useClaimReverseSubmarineSwapMock.mockReturnValueOnce({ data: undefined });
    const { toJSON } = render(<ReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should show error box if swap process failed", () => {
    useClaimReverseSubmarineSwapMock.mockReturnValueOnce({
      error: new Error("GENERAL_ERROR"),
    });
    const { toJSON } = render(<ReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("should fund from peach lightning wallet", async () => {
    const { getByText } = render(<ReverseSubmarineSwap {...props} />);
    expect(usePayInvoiceMock).toHaveBeenCalledWith({
      paymentRequest: bolt11.decode(reverseSwapResponse.invoice),
      amount: 30496000,
    });
    await waitFor(() =>
      expect(
        getByText("fund from Peach wallet").parent?.parent?.parent?.props
          .accessibilityState.disabled,
      ).toBeFalsy(),
    );
    fireEvent.press(getByText("fund from Peach wallet"));
    expect(payInvoiceMock).toHaveBeenCalled();
  });
  it("should render ClaimReverseSubmarineSwap if status transaction.mempool", () => {
    useSwapStatusMock.mockReturnValueOnce({ status: swapStatusMempool });
    const { toJSON } = render(<ReverseSubmarineSwap {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
