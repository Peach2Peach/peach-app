import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

const getUserQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, userId] = queryKey;
  const { result: user } = await peachAPI.public.user.getUser({ userId });

  return user;
};

export const useUser = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: getUserQuery,
  });

  return { user: data, isLoading, error };
};
