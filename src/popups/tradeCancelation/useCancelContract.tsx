import { Contract } from "../../../peach-api/src/@types/contract";
import { peachAPI } from "../../utils/peachAPI";
import { useContractMutation } from "../../views/contract/hooks/useContractMutation";

export function useCancelContract({
  contractId,
  optimisticContract,
}: {
  contractId: string;
  optimisticContract?: Partial<Contract>;
}) {
  return useContractMutation(
    { id: contractId, ...optimisticContract },
    {
      mutationFn: async () => {
        const { error, result } =
          await peachAPI.private.contract.cancelContract({
            contractId,
          });
        if (error?.error || !result)
          throw new Error(error?.error || "Error cancelling contract");
        return result;
      },
    },
  );
}
