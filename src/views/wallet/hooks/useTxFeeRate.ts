import { useQuery } from "@tanstack/react-query";
import { getTransactionFeeRate } from "../../../utils/bitcoin/getTransactionFeeRate";
import type { WalletTx } from "../../../utils/wallet/bdkShim";
import { walletKeys } from "./useUTXOs";

type Props = {
  transaction?: WalletTx;
};

export const useTxFeeRate = ({ transaction }: Props) =>
  useQuery({
    queryKey: walletKeys.transactionFeeRate(
      transaction?.transaction?.id ?? null,
    ),
    queryFn: () => {
      if (!transaction) throw new Error("Transaction not found");
      return getTransactionFeeRate(transaction);
    },
    enabled: !!transaction,
    initialData: 1,
  });
