import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { TEN_SECONDS } from "../../constants";
import { userKeys } from "../../hooks/query/useSelfUser";
import { peachAPI } from "../../utils/peachAPI";

export const useUserOffers = (id: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: userKeys.userOffers(id),
    queryFn: getUserOffersQuery,
    refetchInterval: TEN_SECONDS,
  });

  return { offers: data, isLoading, error, refetch };
};

async function getUserOffersQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof userKeys.userOffers>>) {
  const userId = queryKey[1];
  const { result } = await peachAPI.private.peach069.getUserOpenOffersByUserId({
    userId,
  });

  return result;
}
