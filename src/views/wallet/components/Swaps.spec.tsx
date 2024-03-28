import { networks } from "liquidjs-lib";
import { Animated } from "react-native";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { act, render, waitFor } from "test-utils";
import {
  reverseSwapResponse,
  submarineSwapResponse,
  swapStatusSettled,
} from "../../../../tests/unit/data/boltzData";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { useBoltzSwapStore } from "../../../store/useBoltzSwapStore";
import { PeachLiquidJSWallet } from "../../../utils/wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../../utils/wallet/setWallet";
import { ClaimReverseSubmarineSwap } from "../../fundEscrow/components/ClaimReverseSubmarineSwap";
import { Swaps } from "./Swaps";
import { ClaimSubmarineSwap } from "./submarineSwaps/ClaimSubmarineSwap";
expect.extend({ toMatchDiffSnapshot });

// @ts-expect-error needed for testing
Animated.timing = () => ({
  start: () => jest.fn(),
});

jest.mock("./submarineSwaps/ClaimSubmarineSwap");
jest.mock("../../fundEscrow/components/ClaimReverseSubmarineSwap");

jest.mock("../../../hooks/query/useOfferDetail");
jest
  .requireMock("../../../hooks/query/useOfferDetail")
  .useOfferDetail.mockReturnValue({
    offer: sellOffer,
  });
jest.useFakeTimers();

describe("Swaps", () => {
  const submarineSwap = {
    ...submarineSwapResponse,
    status: { status: "transaction.claim.pending" },
    keyPairIndex: 1,
  };
  const reverseSwap = {
    ...reverseSwapResponse,
    status: { status: "transaction.mempool" },
    keyPairIndex: 1,
    preimage: "preimage",
  };

  const empty = render(<Swaps />).toJSON();
  beforeAll(() => {
    setLiquidWallet(
      new PeachLiquidJSWallet({
        wallet: createTestWallet(),
        network: networks.regtest,
      }),
    );
  });
  afterEach(() => {
    act(() => useBoltzSwapStore.getState().reset());
  });
  it("should render correctly when empty", () => {
    expect(empty).toMatchSnapshot();
  });
  it("should render pending swaps", () => {
    useBoltzSwapStore.getState().saveSwap(submarineSwap);
    useBoltzSwapStore.getState().saveSwap(reverseSwap);

    const { toJSON } = render(<Swaps />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should attempt to claim pending swaps", () => {
    const claimableSubmarineSwap = {
      ...submarineSwap,
      status: { status: "transaction.claim.pending" },
    };
    const claimableReverseSwap = {
      ...reverseSwap,
      status: { status: "transaction.mempool" },
    };
    useBoltzSwapStore.getState().saveSwap(claimableSubmarineSwap);
    useBoltzSwapStore.getState().mapSwap("invoice", submarineSwap.id);

    useBoltzSwapStore.getState().saveSwap(claimableReverseSwap);

    render(<Swaps />);
    expect(ClaimSubmarineSwap).toHaveBeenCalledWith(
      {
        invoice: "invoice",
        keyPairWIF: "cP6XXAbVctdKDKFmEDySbZ46m4Ns3CzzHuaxAEPCnEuUnMX4pvas",
        swapInfo: claimableSubmarineSwap,
      },
      {},
    );
    expect(ClaimReverseSubmarineSwap).toHaveBeenCalledWith(
      {
        address:
          "ert1qrxl2jwt08lnzxn77hrtdlhrqtr8q9vj2tucmxfw9tla59ws6jxwqw0qh3e",
        keyPairWIF: "cP6XXAbVctdKDKFmEDySbZ46m4Ns3CzzHuaxAEPCnEuUnMX4pvas",
        offerId: "38",
        preimage: "preimage",
        swapInfo: claimableReverseSwap,
        swapStatus: claimableReverseSwap.status,
      },
      {},
    );
  });
  it("should render failed swaps", () => {
    useBoltzSwapStore
      .getState()
      .saveSwap({ ...submarineSwap, status: { status: "swap.expired" } });

    const { toJSON } = render(<Swaps />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should show completed swaps for 5 seconds", async () => {
    const WAITING_TIME = 5000;
    useBoltzSwapStore.getState().saveSwap(reverseSwap);
    const { toJSON } = render(<Swaps />);
    const base = toJSON();
    act(() =>
      useBoltzSwapStore
        .getState()
        .saveSwap({ ...reverseSwap, status: swapStatusSettled }),
    );
    const justCompleted = toJSON();
    expect(justCompleted).toMatchDiffSnapshot(base);
    await waitFor(() => {
      jest.advanceTimersByTime(WAITING_TIME);
    });
    expect(toJSON()).toMatchDiffSnapshot(empty);
  });
});
