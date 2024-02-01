import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { peachAPI } from "../../utils/peachAPI";
import { UserStatus } from "./useUserStatus";

export const useUnblockUser = (userId: string) => {
  const queryClient = useQueryClient();
  const showError = useShowErrorBanner();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["user", userId, "status"] });
      const previousStatus = queryClient.getQueryData<UserStatus>([
        "user",
        userId,
        "status",
      ]);
      queryClient.setQueryData<UserStatus>(
        ["user", userId, "status"],
        (oldQueryData: UserStatus | undefined) => {
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
      const { result: status, error } = await peachAPI.private.user.unblockUser(
        { userId },
      );

      if (error) throw new Error(error.error || "Couldn't unblock user");
      return status;
    },
    onError: (err: Error, _variables, context) => {
      queryClient.setQueryData(
        ["user", userId, "status"],
        context?.previousStatus,
      );
      showError(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId, "status"] });
    },
  });
};
