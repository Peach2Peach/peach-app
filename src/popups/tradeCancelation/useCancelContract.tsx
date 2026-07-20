import { peachAPI } from "../../utils/peachAPI";
import { useContractMutation } from "../../views/contract/hooks/useContractMutation";

export function useCancelContract({
  contractId,
  optimisticContract,
  optimistic = true,
}: {
  contractId: string;
  optimisticContract?: Partial<Contract>;
  optimistic?: boolean;
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
    { optimistic },
  );
}
