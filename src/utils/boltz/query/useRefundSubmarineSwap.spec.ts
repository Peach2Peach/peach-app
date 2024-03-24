import { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";
import { act, renderHook } from "test-utils";
import { getError, getResult } from "../../../../peach-api/src/utils/result";
import {
  submarineSwapResponse,
  swapStatusFailed,
} from "../../../../tests/unit/data/boltzData";
import { useBoltzSwapStore } from "../../../store/useBoltzSwapStore";
import { peachAPI } from "../../peachAPI";
import { useRefundSubmarineSwap } from "./useRefundSubmarineSwap";

describe("useRefundSubmarineSwap", () => {
  const initialProps = {
    swap: {
      ...submarineSwapResponse,
      status: swapStatusFailed,
      keyPairIndex: 0,
    },
  };
  const successEvent = {
    nativeEvent: { data: JSON.stringify({ tx: "txHex" }) },
  } as WebViewMessageEvent;
  const postTxSpy = jest.spyOn(peachAPI.public.liquid, "postTx");

  afterEach(() => {
    useBoltzSwapStore.getState().reset();
  });
  it("should broadcast refund tx", async () => {
    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await act(() => result.current.handleRefundMessage(successEvent));
    expect(postTxSpy).toHaveBeenCalledWith({ tx: "txHex" });
  });
  it("should save swap after successful broadcast", async () => {
    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await act(() => result.current.handleRefundMessage(successEvent));
    expect(useBoltzSwapStore.getState().swaps).toEqual({
      [initialProps.swap.id]: {
        ...initialProps.swap,
        status: { ...initialProps.swap.status, status: "transaction.refunded" },
      },
    });
  });
  it("should save swap after broadcasting results missing or spent error", async () => {
    postTxSpy.mockResolvedValue(
      getError({
        error: "INTERNAL_SERVER_ERROR",
        details: "bad-txns-inputs-missingorspent",
      }),
    );

    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await act(() => result.current.handleRefundMessage(successEvent));
    expect(useBoltzSwapStore.getState().swaps).toEqual({
      [initialProps.swap.id]: {
        ...initialProps.swap,
        status: { ...initialProps.swap.status, status: "transaction.refunded" },
      },
    });
  });
  it("should return error", async () => {
    const errorEvent = {
      nativeEvent: { data: JSON.stringify({ error: "1) What" }) },
    } as WebViewMessageEvent;
    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await act(() => result.current.handleRefundMessage(errorEvent));
    expect(result.current.error).toBe("1) What");
  });
  it("should return broadcasting error", async () => {
    postTxSpy.mockResolvedValue(
      getError({
        error: "INTERNAL_SERVER_ERROR",
        details: "bad-txns-inputs-missingorspent",
      }),
    );

    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await act(() => result.current.handleRefundMessage(successEvent));
    expect(result.current.error).toBe("bad-txns-inputs-missingorspent");
  });
  it("should return unhandled broadcasting error", async () => {
    postTxSpy.mockResolvedValue(getResult());

    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await act(() => result.current.handleRefundMessage(successEvent));
    expect(result.current.error).toBe("GENERAL_ERROR");
  });
});
