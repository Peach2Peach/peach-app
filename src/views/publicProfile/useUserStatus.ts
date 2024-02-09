import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { userKeys } from "../../hooks/query/useSelfUser";
import { peachAPI } from "../../utils/peachAPI";

export type UserStatus = Awaited<
  ReturnType<typeof peachAPI.private.user.getUserStatus>
>["result"];

export function useUserStatus(userId: string) {
  return useQuery({
    queryKey: userKeys.userStatus(userId),
    queryFn: getUserStatus,
  });
}

async function getUserStatus({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof userKeys.userStatus>>) {
  const userId = queryKey[1];
  const { result: status, error } = await peachAPI.private.user.getUserStatus({
    userId,
  });

  if (error) throw new Error(error?.error || "Error fetching user's status");
  return status;
}
