import { networks } from "liquidjs-lib";
import { render, renderHook, waitFor } from "test-utils";
import { submarineSwapList } from "../../../../../../tests/unit/data/boltzData";
import { lightningInvoice } from "../../../../../../tests/unit/data/lightningNetworkData";
import {
  mempoolUTXO,
  utxo,
} from "../../../../../../tests/unit/data/liquidBlockExplorerData";
import { createTestWallet } from "../../../../../../tests/unit/helpers/createTestWallet";
import { getError } from "../../../../../../tests/unit/helpers/getError";
import { GlobalPopup } from "../../../../../components/popup/GlobalPopup";
import { sum } from "../../../../../utils/math/sum";
import { PeachLiquidJSWallet } from "../../../../../utils/wallet/PeachLiquidJSWallet";
import {
  clearPeachLiquidWallet,
  setLiquidWallet,
} from "../../../../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../../../../utils/wallet/useLiquidWalletState";
import { useStartSwapOut } from "./useStartSwapOut";

const peachWallet = new PeachLiquidJSWallet({
  network: networks.regtest,
  wallet: createTestWallet(),
});

jest.mock("../../../../../utils/boltz/query/useSubmarineSwaps");
const useSubmarineSwapsMock = jest
  .requireMock("../../../../../utils/boltz/query/useSubmarineSwaps")
  .useSubmarineSwaps.mockReturnValue({
    submarineList: submarineSwapList,
  });

jest.mock("@breeztech/react-native-breez-sdk");
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .receivePayment.mockReturnValue({
    lnInvoice: {
      bolt11: lightningInvoice,
    },
  });

const mockShowErrorBanner = jest.fn();
jest.mock("../../../../../hooks/useShowErrorBanner");
jest
  .requireMock("../../../../../hooks/useShowErrorBanner")
  .useShowErrorBanner.mockReturnValue(mockShowErrorBanner);

const mockHandleTransactionError = jest.fn();
jest.mock("../../../../../hooks/error/useHandleTransactionError");
jest
  .requireMock("../../../../../hooks/error/useHandleTransactionError")
  .useHandleTransactionError.mockReturnValue(mockHandleTransactionError);

describe("useStartSwapOut", () => {
  const minimum = submarineSwapList["L-BTC"].BTC.limits?.minimal ?? 0;
  const maximum = submarineSwapList["L-BTC"].BTC.limits?.maximal ?? 0;

  beforeEach(() => {
    setLiquidWallet(peachWallet);
  });

  afterEach(() => {
    useLiquidWalletState.getState().reset();
  });

  it("should return a function", () => {
    const { result } = renderHook(useStartSwapOut);
    expect(result.current).toBeInstanceOf(Function);
  });
  it("should throw an error if liquid wallet is not ready", async () => {
    clearPeachLiquidWallet();
    const {
      result: { current: startSwapOut },
    } = renderHook(useStartSwapOut);
    const error = await getError<Error>(() => startSwapOut());
    expect(error.message).toBe("WALLET_NOT_READY");
  });
  it("should throw an error if L-BTC <> BTC Pair is not available", async () => {
    useSubmarineSwapsMock.mockReturnValueOnce({
      submarineList: { "L-BTC": {} },
    });
    const {
      result: { current: startSwapOut },
    } = renderHook(useStartSwapOut);
    const error = await getError<Error>(() => startSwapOut());
    expect(error.message).toBe("SWAP_NOT_AVAILABLE_FOR_PAIR");
  });
  it("should throw an error if fees or limits are not known", async () => {
    useSubmarineSwapsMock.mockReturnValueOnce({
      submarineList: {
        "L-BTC": {
          BTC: {
            ...submarineSwapList["L-BTC"].BTC,
            limits: undefined,
          },
        },
      },
    });
    const {
      result: { current: startSwapOut },
    } = renderHook(useStartSwapOut);
    const error = await getError<Error>(() => startSwapOut());
    expect(error.message).toBe("SWAP_CONDITIONS_UNKNOWN");
  });
  it("should show error banner if funds are insufficient for swap", () => {
    useLiquidWalletState.getState().setBalance(minimum - 1);
    const {
      result: { current: startSwapOut },
    } = renderHook(useStartSwapOut);
    startSwapOut();
    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      "10000",
      "9999",
    ]);
  });
  it("should handle transaction error if swap estimation fails", () => {
    useLiquidWalletState.getState().setBalance(minimum);
    const {
      result: { current: startSwapOut },
    } = renderHook(useStartSwapOut);
    startSwapOut();
    expect(mockHandleTransactionError).toHaveBeenCalledWith([
      new Error("BELOW_DUST_LIMIT"),
      undefined,
    ]);
  });
  it("should estimate swappable amount and open SetInvoicePopup", async () => {
    const utxos = [utxo, mempoolUTXO].map((utx) => ({
      ...utx,
      derivationPath: "1",
    }));
    useLiquidWalletState.getState().setUTXO(utxos);
    useLiquidWalletState
      .getState()
      .setBalance([utxo, mempoolUTXO].map((u) => u.value).reduce(sum, 0));
    const {
      result: { current: startSwapOut },
    } = renderHook(useStartSwapOut);
    startSwapOut();
    const { queryByText } = render(<GlobalPopup />);

    await waitFor(() =>
      expect(queryByText("Create an invoice for 228543 sats")).toBeTruthy(),
    );
  });
  it("should estimate swappable amount at max limit", async () => {
    const utxos = [utxo, mempoolUTXO].map((utx) => ({
      ...utx,
      value: maximum,
      derivationPath: "1",
    }));
    useLiquidWalletState.getState().setUTXO(utxos);
    useLiquidWalletState
      .getState()
      .setBalance(utxos.map((u) => u.value).reduce(sum, 0));
    const {
      result: { current: startSwapOut },
    } = renderHook(useStartSwapOut);
    startSwapOut();
    const { queryByText } = render(<GlobalPopup />);
    await waitFor(() =>
      expect(queryByText("Create an invoice for 4289449 sats")).toBeTruthy(),
    );
  });
});
