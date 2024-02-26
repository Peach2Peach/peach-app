import { Transaction, address } from "bitcoinjs-lib";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { useHandleTransactionError } from "../../../hooks/error/useHandleTransactionError";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { buildBumpFeeTransaction } from "../../../utils/wallet/bitcoin/transaction/buildBumpFeeTransaction";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { ConfirmRbfPopup } from "../components/ConfirmRbfPopup";

const useRemoveTxFromPeachWallet = () => {
  const [removeTransaction] = useWalletState(
    (state) => [state.removeTransaction],
    shallow,
  );

  const removeTxFromPeachWallet = useCallback(
    (txId: string) => {
      if (!peachWallet) throw new Error("PeachWallet not set");
      removeTransaction(txId);
      peachWallet.transactions = peachWallet.transactions.filter(
        (tx) => tx.txid !== txId,
      );
    },
    [removeTransaction],
  );

  return removeTxFromPeachWallet;
};

type Props = {
  transaction?: Transaction | null;
  currentFeeRate: number;
  newFeeRate: number;
  sendingAmount: number;
};
export const useBumpFees = ({
  transaction,
  currentFeeRate,
  newFeeRate,
  sendingAmount,
}: Props) => {
  const setPopup = useSetPopup();
  const handleTransactionError = useHandleTransactionError();
  const removeTxFromPeachWallet = useRemoveTxFromPeachWallet();
  const navigation = useStackNavigation();

  const onSuccess = useCallback(
    (newTxId: string) => {
      navigation.goBack();
      if (transaction) removeTxFromPeachWallet(transaction.getId());
      navigation.replace("transactionDetails", { txId: newTxId });
    },
    [navigation, removeTxFromPeachWallet, transaction],
  );

  const bumpFees = useCallback(async () => {
    if (!transaction || !peachWallet) return;

    try {
      const bumpFeeTransaction = await buildBumpFeeTransaction(
        transaction.getId(),
        Number(newFeeRate),
        transaction.outs.length === 1
          ? address.fromOutputScript(transaction.outs[0].script, getNetwork())
          : undefined,
      );
      const finishedTransaction =
        await peachWallet.finishTransaction(bumpFeeTransaction);
      setPopup(
        <ConfirmRbfPopup
          {...{
            currentFeeRate,
            newFeeRate,
            transaction,
            sendingAmount,
            finishedTransaction,
          }}
          onSuccess={onSuccess}
        />,
      );
    } catch (e) {
      handleTransactionError(e);
    }
  }, [
    currentFeeRate,
    handleTransactionError,
    newFeeRate,
    onSuccess,
    sendingAmount,
    setPopup,
    transaction,
  ]);

  return bumpFees;
};
