import { networks } from "liquidjs-lib";
import { renderHook } from "test-utils";
import { getResult } from "../../../../../../peach-api/src/utils/result/getResult";
import { submarineSwapResponse } from "../../../../../../tests/unit/data/boltzData";
import {
  mempoolUTXO,
  utxo,
} from "../../../../../../tests/unit/data/liquidBlockExplorerData";
import { createTestWallet } from "../../../../../../tests/unit/helpers/createTestWallet";
import { useBoltzSwapStore } from "../../../../../store/useBoltzSwapStore";
import { sum } from "../../../../../utils/math/sum";
import { peachAPI } from "../../../../../utils/peachAPI";
import { PeachLiquidJSWallet } from "../../../../../utils/wallet/PeachLiquidJSWallet";
import {
  clearPeachLiquidWallet,
  setLiquidWallet,
} from "../../../../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../../../../utils/wallet/useLiquidWalletState";
import { useSwapOut } from "./useSwapOut";

const peachLiquidWallet = new PeachLiquidJSWallet({
  network: networks.regtest,
  wallet: createTestWallet(),
});
const syncWalletSpy = jest
  .spyOn(peachLiquidWallet, "syncWallet")
  .mockReturnValue(Promise.resolve());

jest.mock("../../../../../utils/boltz/query/postSubmarineSwapQuery");
const postSubmarineSwapQueryMock = jest
  .requireMock("../../../../../utils/boltz/query/postSubmarineSwapQuery")
  .postSubmarineSwapQuery.mockResolvedValue({
    swapInfo: submarineSwapResponse,
    keyPairIndex: 0,
  });

const postTxSpy = jest
  .spyOn(peachAPI.public.liquid, "postTx")
  .mockResolvedValue(getResult({ txId: "txId" }));

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

describe("useSwapOut", () => {
  const initialProps = {
    miningFees: 210,
    invoice: "lninvoice",
  };
  beforeEach(() => {
    setLiquidWallet(peachLiquidWallet);
  });

  afterEach(() => {
    useLiquidWalletState.getState().reset();
  });

  it("should return defaults", () => {
    const { result } = renderHook(useSwapOut, { initialProps });
    expect(result.current).toEqual({
      swapOut: expect.any(Function),
      postSwapInProgress: false,
      swapInfo: undefined,
      keyPairWIF: undefined,
    });
  });
  it("should show error banner if no invoice has been set is not ready", async () => {
    const {
      result: {
        current: { swapOut },
      },
    } = renderHook(useSwapOut, {
      initialProps: {
        ...initialProps,
        invoice: "",
      },
    });
    await swapOut();
    expect(mockShowErrorBanner).toHaveBeenCalledWith("INVOICE_UNDEFINED");
  });
  it("should show error banner if liquid wallet is not ready", async () => {
    clearPeachLiquidWallet();
    const {
      result: {
        current: { swapOut },
      },
    } = renderHook(useSwapOut, { initialProps });
    await swapOut();
    expect(mockShowErrorBanner).toHaveBeenCalledWith("WALLET_NOT_READY");
  });
  it("should show error banner if no lockup address has been returned", async () => {
    postSubmarineSwapQueryMock.mockResolvedValueOnce({
      swapInfo: { ...submarineSwapResponse, address: undefined },
      keyPairIndex: 0,
    });
    const {
      result: {
        current: { swapOut },
      },
    } = renderHook(useSwapOut, { initialProps });
    await swapOut();
    expect(mockShowErrorBanner).toHaveBeenCalledWith("NO_LOCKUP_ADDRESS");
  });
  it("should save swap for later reference if it does not exist yet", async () => {
    const {
      result: {
        current: { swapOut },
      },
    } = renderHook(useSwapOut, { initialProps });
    await swapOut();
    expect(
      useBoltzSwapStore.getState().swaps[submarineSwapResponse.id],
    ).toEqual({
      ...submarineSwapResponse,
      keyPairIndex: 0,
    });
    expect(useBoltzSwapStore.getState().map[initialProps.invoice]).toEqual([
      submarineSwapResponse.id,
    ]);
  });
  it("should build and broadcast lockup transaction and sync wallet in the end", async () => {
    const expectedTx =
      "0200000001022fe265fb124e16d49f5d716ff31df3c25cad0ef7d854f6deb2da81b6e6b5e59d000000000000000000258e1884be1a3c1daf7ead20f55f7de45006e773ee7b770fe4a51d3ff643550c000000000000000000030125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000075e2002251209c41123278485ae9cec4c5b6b2d7cbd4129618759bc79fe556e47c2d2d88276b0125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a010000000000030bbc001600144b901a92dcae25c5644e596ddeea06759e6e46b70125b251070e29ca19043cf33ccd7324e2ddab03ecc4ae0b5e77c4fc0e5cf6c95a0100000000000000d2000000000000000002473044022064270a51d8be3a9f2abf5ee78ba67ac21b53743b5d54ee248c72fa2b3972392b02203d942d1f57adaebbfa17cb39f359295535fef1da094642f9d53c5080daf4162c01210250a9f7daa410b0de468ff31ec860b76d04981331800778ab9ffe8cbe8dace33400000002483045022100b6c07c2fb8b58efcdd3c961111af135a60ec1ae8abfcd926ba7ab4783f50ffc902203f5a5df44c68652da794498d0889567067d137c50f98f4f709061a18aeda392601210250a9f7daa410b0de468ff31ec860b76d04981331800778ab9ffe8cbe8dace33400000000000000";
    const utxos = [utxo, mempoolUTXO].map((utx) => ({
      ...utx,
      derivationPath: "1",
    }));
    useLiquidWalletState.getState().setUTXO(utxos);
    useLiquidWalletState
      .getState()
      .setBalance([utxo, mempoolUTXO].map((u) => u.value).reduce(sum, 0));

    const {
      result: {
        current: { swapOut },
      },
    } = renderHook(useSwapOut, { initialProps });
    await swapOut();
    expect(postTxSpy).toHaveBeenCalledWith({ tx: expectedTx });
    expect(syncWalletSpy).toHaveBeenCalled();
  });
});
