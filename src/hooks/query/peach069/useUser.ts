import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

async function getUserDetails({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof userDetailsKeys.detail>>) {
  const [, , userId] = queryKey;
  const { result } = await peachAPI.public.user.getUser({
    userId,
  });

  return result;
}

const userDetailsKeys = {
  all: ["user"] as const,
  details: () => [...userDetailsKeys.all, "details"] as const,
  detail: (id: string) => [...userDetailsKeys.details(), id] as const,
};

export function useUserDetails({ userId }: { userId: string }) {
  const queryData = useQuery({
    queryKey: userDetailsKeys.detail(userId),
    queryFn: getUserDetails,
  });

  return queryData;
}
