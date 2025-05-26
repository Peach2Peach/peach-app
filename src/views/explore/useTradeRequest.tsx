import { useQuery } from "@tanstack/react-query";
import { TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { offerKeys, tradeRequestKeys } from "../../hooks/query/offerKeys";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { queryClient } from "../../queryClient";
import { peachAPI } from "../../utils/peachAPI";

export function useTradeRequest(offerId: string, requestingOfferId?: string) {
  const { user } = useSelfUser();
  return useQuery({
    queryKey: offerKeys.tradeRequest(offerId),
    queryFn: async () => {
      const { result, error } = await peachAPI.private.offer.getTradeRequest({
        offerId,
        requestingOfferId,
      });

      if (error) throw new Error(error.error);

      if (result && user) {
        queryClient.setQueryData(
          tradeRequestKeys.detail(offerId, user.id),
          result.tradeRequest,
        );
      }
      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * 1000,
  });
}
