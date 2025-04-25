import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { contractKeys } from "../../../hooks/query/useContractDetail";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";

export function useContractMutation<TData = unknown, TVariables = void>(
  optimisticContract: Partial<Contract> & { id: string },
  options: UseMutationOptions<TData, Error, TVariables>,
) {
  const queryClient = useQueryClient();
  const showError = useShowErrorBanner();

  return useMutation({
    ...options,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: contractKeys.detail(optimisticContract.id),
      });
      const previousData = queryClient.getQueryData<Contract>(
        contractKeys.detail(optimisticContract.id),
      );
      queryClient.setQueryData(
        contractKeys.detail(optimisticContract.id),
        (oldQueryData: Contract | undefined) => {
          if (!oldQueryData) return oldQueryData;
          return {
            ...oldQueryData,
            ...optimisticContract,
            lastModified: new Date(),
          };
        },
      );

      return { previousData };
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(
        contractKeys.detail(optimisticContract.id),
        context?.previousData,
      );
      showError(err.message);
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(optimisticContract.id),
        }),
        queryClient.invalidateQueries({ queryKey: contractKeys.summaries() }),
      ]),
  });
}
