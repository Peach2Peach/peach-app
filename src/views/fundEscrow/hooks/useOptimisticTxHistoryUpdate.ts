import { TxDetails } from "bdk-rn";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { labelAddressByTransaction } from "../../../utils/wallet/labelAddressByTransaction";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { txIdToString } from "../../wallet/helpers/txIdToString";

// can be removed after sync issue have been resolved
export const useOptimisticTxHistoryUpdate = () => {
  const [updateTxOfferMap, addTransaction] = useWalletState(
    (state) => [state.updateTxOfferMap, state.addTransaction],
    shallow,
  );
  const optimisticTxHistoryUpdate = useCallback(
    (txDetails: TxDetails, offerIds: string[]) => {
      addTransaction(txDetails);
      updateTxOfferMap(txIdToString(txDetails.tx), offerIds);
      labelAddressByTransaction(txDetails);
    },
    [addTransaction, updateTxOfferMap],
  );
  return optimisticTxHistoryUpdate;
};
