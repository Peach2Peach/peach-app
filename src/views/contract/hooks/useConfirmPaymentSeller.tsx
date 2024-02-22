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
        const { result, error } =
          await signReleaseTxOfContract(contract);
        if (!result?.releaseTransaction) {
          throw new Error(error);
        }

        const { error: err } =
          await peachAPI.private.contract.confirmPaymentSeller({
            contractId: contract.id,
            releaseTransaction: result.releaseTransaction,
            batchReleasePsbt: result.batchReleasePsbt,
          });
        if (err) throw new Error(err.error);
      },
    },
  );
}
