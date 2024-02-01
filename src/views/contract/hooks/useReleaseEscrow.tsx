import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractKeys } from "../../../hooks/query/useContractDetail";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { signReleaseTxOfContract } from "../../../utils/contract/signReleaseTxOfContract";
import { peachAPI } from "../../../utils/peachAPI";

export const useReleaseEscrow = (contract: Contract) => {
  const showError = useShowErrorBanner();

  const queryClient = useQueryClient();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: contractKeys.detail(contract.id),
      });
      const previousData = queryClient.getQueryData<Contract>([
        "contract",
        contract.id,
      ]);
      queryClient.setQueryData(
        contractKeys.detail(contract.id),
        (old: Contract | undefined) => {
          if (!old) return old;
          return {
            ...old,
            paymentConfirmed: new Date(),
            releaseTxId: "",
            disputeResolvedDate: new Date(),
          };
        },
      );
      return { previousData };
    },
    mutationFn: async () => {
      const { releaseTransaction, batchReleasePsbt, errorMsg } =
        signReleaseTxOfContract(contract);
      if (!releaseTransaction) {
        throw new Error(errorMsg);
      }

      const { error: err } =
        await peachAPI.private.contract.confirmPaymentSeller({
          contractId: contract.id,
          releaseTransaction,
          batchReleasePsbt,
        });
      if (err) {
        throw new Error(err.error);
      }
    },
    onError: (err: string | undefined, _variables, context) => {
      queryClient.setQueryData(
        contractKeys.detail(contract.id),
        context?.previousData,
      );
      showError(err);
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contract.id),
        }),
        queryClient.invalidateQueries({ queryKey: contractKeys.summaries() }),
      ]),
  });
};
