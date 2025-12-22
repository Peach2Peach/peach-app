import { useQuery } from "@tanstack/react-query";
import { TxDetails } from "bdk-rn";
import { getTransactionFeeRate } from "../../../utils/bitcoin/getTransactionFeeRate";
import { txIdToString } from "../helpers/txIdToString";
import { walletKeys } from "./useUTXOs";

type Props = {
  transaction?: TxDetails;
};

export const useTxFeeRate = ({ transaction }: Props) =>
  useQuery({
    queryKey: walletKeys.transactionFeeRate(
      transaction ? txIdToString(transaction.tx) : null
    ),
    queryFn: async () => {
      if (!transaction) throw new Error("Transaction not found");
      const feeRate = await getTransactionFeeRate(transaction);
      return feeRate;
    },
    enabled: !!transaction,
    initialData: 1,
  });
