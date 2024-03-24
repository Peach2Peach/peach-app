import { useQuery } from "@tanstack/react-query";
import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { Transaction } from "../../../../peach-api/src/@types/electrs-liquid";
import { getTransactionFeeRate } from "../../../utils/bitcoin/getTransactionFeeRate";
import { walletKeys } from "./useUTXOs";

type Props = {
  transaction?: TransactionDetails | Transaction;
};

const isBDKTransaction = (
  transaction: TransactionDetails | Transaction,
): transaction is TransactionDetails => "transaction" in transaction;

export const useTxFeeRate = ({ transaction }: Props) =>
  useQuery({
    queryKey: walletKeys.transactionFeeRate(
      transaction
        ? isBDKTransaction(transaction)
          ? transaction?.transaction?.id ?? null
          : transaction?.txid
        : null,
    ),
    queryFn: () => {
      if (!transaction) throw new Error("Transaction not found");
      if (isBDKTransaction(transaction)) {
        return getTransactionFeeRate(transaction);
      }
      return transaction.fee / transaction.size;
    },
    enabled: !!transaction,
    initialData: 1,
  });
