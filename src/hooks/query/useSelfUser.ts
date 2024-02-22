import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

export const userKeys = {
  all: ["user"] as const,
  user: (id: string) => [...userKeys.all, id] as const,
  userStatus: (id: string) => [...userKeys.user(id), "status"] as const,
  self: () => [...userKeys.all, "self"] as const,
  tradingLimits: () => [...userKeys.self(), "tradingLimits"] as const,
};

export const useSelfUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: userKeys.self(),
    queryFn: getUserQuery,
  });
  return { user: data, isLoading };
};

async function getUserQuery() {
  const { result, error } = await peachAPI.private.user.getSelfUser();

  if (error) throw new Error(error.message);
  return result;
}
