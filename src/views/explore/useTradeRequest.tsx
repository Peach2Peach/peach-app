import { useQuery } from "@tanstack/react-query";
import { TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useTradeRequest(offerId: string, requestingOfferId?: string) {
  return useQuery({
    queryKey: offerKeys.tradeRequest(offerId),
    queryFn: async () => {
      const { result, error } = await peachAPI.private.offer.getTradeRequest({
        offerId,
        requestingOfferId,
      });
      if (error) throw new Error(error.error);

      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * 1000,
  });
}
