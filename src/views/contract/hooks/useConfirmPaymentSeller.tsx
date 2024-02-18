import { signReleaseTxOfContract } from "../../../utils/contract/signReleaseTxOfContract";
import { peachAPI } from "../../../utils/peachAPI";
import { useContractMutation } from "./useContractMutation";

export function useConfirmPaymentSeller({
  contract,
  optimisticContract,
}: {
  contract: Contract;
  optimisticContract?: Partial<Contract>;
}) {
  return useContractMutation(
    {
      id: contract.id,
      ...optimisticContract,
    },
    {
      mutationFn: async () => {
        const { releaseTransaction, batchReleasePsbt, errorMsg } =
          await signReleaseTxOfContract(contract);
        if (!releaseTransaction) {
          throw new Error(errorMsg);
        }

        const { error: err } =
          await peachAPI.private.contract.confirmPaymentSeller({
            contractId: contract.id,
            releaseTransaction,
            batchReleasePsbt,
          });
        if (err) throw new Error(err.error);
      },
    },
  );
}
