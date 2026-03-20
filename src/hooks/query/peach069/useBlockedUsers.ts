import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

export const user69BlockedUsersKeys = {
  all: ["peach069BlockedUsers"] as const,
  details: () => [...user69BlockedUsersKeys.all, "details"] as const,
};

export const useBlockedUsers = () => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69BlockedUsersKeys.details(),
    queryFn: getBlockedUsers,
  });

  return { blockedUsers: data, isLoading, isFetching, refetch, error };
};

async function getBlockedUsers({}: QueryFunctionContext<
  ReturnType<typeof user69BlockedUsersKeys.details>
>) {
  const { result } = await peachAPI.private.peach069.getBlockedUsers({});

  return result?.users;
}
