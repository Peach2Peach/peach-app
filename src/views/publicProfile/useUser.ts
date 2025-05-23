import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { userKeys } from "../../hooks/query/useSelfUser";
import { peachAPI } from "../../utils/peachAPI";

export const useUser = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: userKeys.user(id),
    queryFn: getUserQuery,
  });
  return { user: data, isLoading, error };
};

async function getUserQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof userKeys.user>>) {
  const [, userId] = queryKey;
  const { result: user } = await peachAPI.public.user.getUser({ userId });
  return user;
}
