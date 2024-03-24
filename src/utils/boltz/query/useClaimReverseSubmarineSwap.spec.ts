import { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";
import { act, renderHook } from "test-utils";
import { sellOfferLiquid } from "../../../../tests/unit/data/offerData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { peachAPI } from "../../peachAPI";
import { useClaimReverseSubmarineSwap } from "./useClaimReverseSubmarineSwap";

describe("useClaimReverseSubmarineSwap", () => {
  const initialProps = {
    offerId: sellOfferLiquid.id,
  };
  const successEvent = {
    nativeEvent: { data: JSON.stringify({ tx: "txHex" }) },
  } as WebViewMessageEvent;
  it("should update query client cache on success", async () => {
    const fundingStatus = {
      offerId: sellOfferLiquid.id,
      escrow: sellOfferLiquid.escrow,
      escrows: sellOfferLiquid.escrows,
      returnAddress: sellOfferLiquid.returnAddress,
      funding: sellOfferLiquid.funding,
      fundingLiquid: sellOfferLiquid.fundingLiquid,
      userConfirmationRequired: false,
    };
    queryClient.setQueryData(
      offerKeys.fundingStatus(sellOfferLiquid.id),
      fundingStatus,
    );
    const { result } = renderHook(useClaimReverseSubmarineSwap, {
      initialProps,
    });
    await act(() => result.current.handleClaimMessage(successEvent));
    expect(
      queryClient.getQueryData(offerKeys.fundingStatus(sellOfferLiquid.id)),
    ).toEqual({
      ...fundingStatus,
      fundingLiquid: {
        ...fundingStatus.fundingLiquid,
        status: "MEMPOOL",
        txIds: ["txId"],
      },
    });
  });
  it("should broadcast claim tx", async () => {
    const postTxSpy = jest.spyOn(peachAPI.public.liquid, "postTx");
    const { result } = renderHook(useClaimReverseSubmarineSwap, {
      initialProps,
    });
    await result.current.handleClaimMessage(successEvent);
    expect(postTxSpy).toHaveBeenCalledWith({ tx: "txHex" });
  });
  it("should return error", async () => {
    const errorEvent = {
      nativeEvent: { data: JSON.stringify({ error: "1) What" }) },
    } as WebViewMessageEvent;
    const { result } = renderHook(useClaimReverseSubmarineSwap, {
      initialProps,
    });
    await act(() => result.current.handleClaimMessage(errorEvent));
    expect(result.current.error).toBe("1) What");
  });
});
