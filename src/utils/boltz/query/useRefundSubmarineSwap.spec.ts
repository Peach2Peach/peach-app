import { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";
import { act, renderHook } from "test-utils";
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
  it("should save swap on status update", async () => {
    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await act(() => result.current.handleRefundMessage(successEvent));
    expect(useBoltzSwapStore.getState().swaps).toEqual({});
  });
  it("should broadcast refund tx", async () => {
    const postTxSpy = jest.spyOn(peachAPI.public.liquid, "postTx");
    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await result.current.handleRefundMessage(successEvent);
    expect(postTxSpy).toHaveBeenCalledWith({ tx: "txHex" });
  });
  it("should return error", async () => {
    const errorEvent = {
      nativeEvent: { data: JSON.stringify({ error: "1) What" }) },
    } as WebViewMessageEvent;
    const { result } = renderHook(useRefundSubmarineSwap, { initialProps });
    await act(() => result.current.handleRefundMessage(errorEvent));
    expect(result.current.error).toBe("1) What");
  });
});
