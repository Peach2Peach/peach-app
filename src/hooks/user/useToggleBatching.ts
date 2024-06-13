import { useMutation, useQueryClient } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";
import { userKeys } from "../query/useSelfUser";
import { useShowErrorBanner } from "../useShowErrorBanner";

type Props = Pick<User, "isBatchingEnabled">;

export const useToggleBatching = ({ isBatchingEnabled }: Props) => {
  const queryClient = useQueryClient();
  const showErrorBanner = useShowErrorBanner();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKeys.self() });
      const previousData = queryClient.getQueryData<User>(userKeys.self());
      queryClient.setQueryData(
        userKeys.self(),
        (oldQueryData: User | undefined) =>
          oldQueryData && {
            ...oldQueryData,
            isBatchingEnabled: !isBatchingEnabled,
          },
      );

      return { previousData };
    },
    mutationFn: async () => {
      const { error } = await peachAPI.private.user.enableTransactionBatching({
        enableBatching: !isBatchingEnabled,
        riskAcknowledged: true,
      });
      if (error) throw new Error(error.error || "Failed to toggle batching");
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(userKeys.self(), context?.previousData);
      showErrorBanner(err.message);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.self() }),
  });
};
