import { useQuery } from "@tanstack/react-query";
import { TransactionDetails } from "bdk-rn";
import { getTransactionFeeRate } from "../../../utils/bitcoin/getTransactionFeeRate";
import { walletKeys } from "./useUTXOs";

type Props = {
  transaction?: TransactionDetails;
};

export const useTxFeeRate = ({ transaction }: Props) =>
  useQuery({
    queryKey: walletKeys.transactionFeeRate(
      transaction?.transaction?.id ?? null,
    ),
    queryFn: async () => {
      if (!transaction) throw new Error("Transaction not found");
      const feeRate = await getTransactionFeeRate(transaction);
      return feeRate;
    },
    enabled: !!transaction,
    initialData: 1,
  });
