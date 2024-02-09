import { useQuery } from "@tanstack/react-query";
import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { Transaction } from "bitcoinjs-lib";
import { walletKeys } from "./useUTXOs";

type Props = {
  localTx?: TransactionDetails;
};

export const useMappedTransactionDetails = ({ localTx }: Props) =>
  useQuery({
    queryKey: walletKeys.serializedTransaction(
      localTx?.transaction?.id ?? null,
    ),
    queryFn: async () => {
      if (!localTx?.transaction) throw new Error("Transaction not found");

      const serialized = await localTx.transaction.serialize();
      const transaction = Transaction.fromBuffer(Buffer.from(serialized));
      return transaction;
    },
    enabled: !!localTx?.transaction,
  });
