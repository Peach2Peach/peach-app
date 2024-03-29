import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "../../hooks/query/useSelfUser";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { peachAPI } from "../../utils/peachAPI";
import { matchesKeys } from "../search/hooks/useOfferMatches";
import { UserStatus } from "./useUserStatus";

export const useBlockUser = (userId: string) => {
  const queryClient = useQueryClient();
  const showError = useShowErrorBanner();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: userKeys.userStatus(userId),
      });
      const previousStatus = queryClient.getQueryData<UserStatus>(
        userKeys.userStatus(userId),
      );
      queryClient.setQueryData<UserStatus>(
        userKeys.userStatus(userId),
        (oldQueryData: UserStatus) => {
          if (oldQueryData) {
            return {
              ...oldQueryData,
              isBlocked: true,
            };
          }
          return undefined;
        },
      );
      return { previousStatus };
    },
    mutationFn: async () => {
      const { result: status, error } = await peachAPI.private.user.blockUser({
        userId,
      });

      if (error) throw new Error(error.error || "Couldn't block user");
      return status;
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(
        userKeys.userStatus(userId),
        context?.previousStatus,
      );
      showError(err.message);
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: userKeys.userStatus(userId),
        }),
        queryClient.invalidateQueries({ queryKey: matchesKeys.matches }),
      ]),
  });
};
