import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { labelAddressByTransaction } from "../../../utils/wallet/labelAddressByTransaction";
import { useWalletState } from "../../../utils/wallet/walletStore";

// can be removed after sync issue have been resolved
export const useOptimisticTxHistoryUpdateLiquid = () => {
  const [updateTxOfferMap, getFundMultipleByOfferId] = useWalletState(
    (state) => [state.updateTxOfferMap, state.getFundMultipleByOfferId],
    shallow,
  );
  const optimisticTxHistoryUpdate = useCallback(
    (txId: string, offerId: string) => {
      const fundMultiple = getFundMultipleByOfferId(offerId);
      updateTxOfferMap(txId, fundMultiple?.offerIds || [offerId]);
      labelAddressByTransaction(txId);
    },
    [getFundMultipleByOfferId, updateTxOfferMap],
  );
  return optimisticTxHistoryUpdate;
};
