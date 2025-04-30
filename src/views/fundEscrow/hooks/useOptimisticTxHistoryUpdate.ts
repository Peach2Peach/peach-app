import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { labelAddressByTransaction } from "../../../utils/wallet/labelAddressByTransaction";
import { useWalletState } from "../../../utils/wallet/walletStore";

// can be removed after sync issue have been resolved
export const useOptimisticTxHistoryUpdate = () => {
  const [updateTxOfferMap, addTransaction, getFundMultipleByOfferId] =
    useWalletState(
      useShallow((state) => [
        state.updateTxOfferMap,
        state.addTransaction,
        state.getFundMultipleByOfferId,
      ]),
    );
  const optimisticTxHistoryUpdate = useCallback(
    async (txDetails: TransactionDetails, offerId: string) => {
      const fundMultiple = getFundMultipleByOfferId(offerId);
      addTransaction(txDetails);
      updateTxOfferMap(txDetails.txid, fundMultiple?.offerIds || [offerId]);
      await labelAddressByTransaction(txDetails);
    },
    [addTransaction, getFundMultipleByOfferId, updateTxOfferMap],
  );
  return optimisticTxHistoryUpdate;
};
