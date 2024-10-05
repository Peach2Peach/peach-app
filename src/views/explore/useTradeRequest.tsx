import { useQuery } from "@tanstack/react-query";
import { offerKeys } from "../../hooks/query/offerKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useTradeRequest(offerId: string) {
  return useQuery({
    queryKey: offerKeys.tradeRequest(offerId),
    queryFn: async () => {
      const { result, error } = await peachAPI.private.offer.getTradeRequest({
        offerId,
      });
      if (error) throw new Error(error.error);
      return result;
    },
  });
}
