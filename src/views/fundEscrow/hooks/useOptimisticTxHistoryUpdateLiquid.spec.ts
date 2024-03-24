import { renderHook } from "@testing-library/react-native";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useOptimisticTxHistoryUpdateLiquid } from "./useOptimisticTxHistoryUpdateLiquid";

describe("useOptimisticTxHistoryUpdateLiquid", () => {
  const txId = "txId";
  const offerId = sellOffer.id;
  beforeEach(() => {
    queryClient.setQueryData(offerKeys.detail(offerId), sellOffer);
  });
  it("update tx offer map", () => {
    const { result } = renderHook(useOptimisticTxHistoryUpdateLiquid);
    result.current(txId, offerId);
    expect(useWalletState.getState().txOfferMap).toEqual({ txId: ["38"] });
  });
  it("label address by transaction", () => {
    const { result } = renderHook(useOptimisticTxHistoryUpdateLiquid);
    result.current(txId, offerId);
    expect(useWalletState.getState().addressLabelMap).toEqual({
      bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh: "P‑26",
    });
  });
});
