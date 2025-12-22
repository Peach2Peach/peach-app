import { useQuery } from "@tanstack/react-query";
import { TxDetails } from "bdk-rn";
import { Transaction } from "bitcoinjs-lib";
import { txIdToString } from "../helpers/txIdToString";
import { walletKeys } from "./useUTXOs";

type Props = {
  localTx?: TxDetails;
};

export const useMappedTransactionDetails = ({ localTx }: Props) =>
  useQuery({
    queryKey: walletKeys.serializedTransaction(
      localTx ? txIdToString(localTx.tx) : null,
    ),
    queryFn: async () => {
      if (!localTx) throw new Error("Transaction not found");

      const serialized = localTx.tx.serialize();
      return Transaction.fromBuffer(Buffer.from(serialized));
    },
    enabled: !!localTx,
  });
