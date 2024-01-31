import { useQuery } from "@tanstack/react-query";
import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { getTransactionFeeRate } from "../../../utils/bitcoin/getTransactionFeeRate";

type Props = {
  transaction?: TransactionDetails;
};

export const useTxFeeRate = ({ transaction }: Props) =>
  useQuery({
    queryKey: ["transaction", "feeRate", transaction?.transaction?.id],
    queryFn: async () => {
      if (!transaction) throw new Error("Transaction not found");
      const feeRate = await getTransactionFeeRate(transaction);
      return feeRate;
    },
    enabled: !!transaction,
    initialData: 1,
  });
