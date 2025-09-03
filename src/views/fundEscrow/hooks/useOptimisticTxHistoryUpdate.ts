import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { labelAddressByTransaction } from "../../../utils/wallet/labelAddressByTransaction";
import { useWalletState } from "../../../utils/wallet/walletStore";

// can be removed after sync issue have been resolved
export const useOptimisticTxHistoryUpdate = () => {
  const [updateTxOfferMap, addTransaction] = useWalletState(
    (state) => [state.updateTxOfferMap, state.addTransaction],
    shallow,
  );
  const optimisticTxHistoryUpdate = useCallback(
    (txDetails: TransactionDetails, offerIds: string[]) => {
      addTransaction(txDetails);
      updateTxOfferMap(txDetails.txid, offerIds);
      labelAddressByTransaction(txDetails);
    },
    [addTransaction, updateTxOfferMap],
  );
  return optimisticTxHistoryUpdate;
};
