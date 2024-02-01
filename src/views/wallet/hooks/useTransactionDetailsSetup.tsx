import { useMemo } from "react";
import { useRoute } from "../../../hooks/useRoute";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { getTxSummary } from "../helpers/getTxSummary";
import { useMappedTransactionDetails } from "./useMappedTransactionDetails";

export const useTransactionDetailsSetup = () => {
  const { txId } = useRoute<"transactionDetails">().params;
  const localTx = useWalletState((state) => state.getTransaction(txId));
  const { data: transactionDetails } = useMappedTransactionDetails({ localTx });
  const transactionSummary = useMemo(
    () => (localTx ? getTxSummary(localTx) : undefined),
    [localTx],
  );

  return { localTx, transactionDetails, transactionSummary };
};
