import { useQuery } from "@tanstack/react-query";
import { Transaction } from "bitcoinjs-lib";
import { hexToBytes, type WalletTx } from "../../../utils/wallet/bdkShim";
import { walletKeys } from "./useUTXOs";

type Props = {
  localTx?: WalletTx;
};

export const useMappedTransactionDetails = ({ localTx }: Props) =>
  useQuery({
    queryKey: walletKeys.serializedTransaction(
      localTx?.transaction?.id ?? null,
    ),
    queryFn: () => {
      if (!localTx?.transaction) throw new Error("Transaction not found");
      return Transaction.fromBuffer(Buffer.from(hexToBytes(localTx.transaction.hex)));
    },
    enabled: !!localTx?.transaction,
  });
