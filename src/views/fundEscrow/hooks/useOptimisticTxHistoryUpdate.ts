import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import type { WalletTx } from "../../../utils/wallet/bdkShim";
import { labelAddressByTransaction } from "../../../utils/wallet/labelAddressByTransaction";
import { useWalletState } from "../../../utils/wallet/walletStore";

export const useOptimisticTxHistoryUpdate = () => {
  const [updateTxOfferMap, addTransaction] = useWalletState(
    (state) => [state.updateTxOfferMap, state.addTransaction],
    shallow,
  );
  const optimisticTxHistoryUpdate = useCallback(
    (txDetails: WalletTx, offerIds: string[]) => {
      addTransaction(txDetails);
      updateTxOfferMap(txDetails.txid, offerIds);
      labelAddressByTransaction(txDetails);
    },
    [addTransaction, updateTxOfferMap],
  );
  return optimisticTxHistoryUpdate;
};
