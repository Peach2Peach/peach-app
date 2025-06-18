import { useQuery } from "@tanstack/react-query";
import { MSINASECOND, TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { tradeRequestKeys } from "../../hooks/query/tradeRequestKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useTradeRequestForBuyOffer(
  offerId: string,
  requestingOfferId?: string,
  enabled = false,
) {
  return useQuery({
    queryKey: tradeRequestKeys.tradeRequestForBuyOffer(
      offerId,
      requestingOfferId,
    ),
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getTradeRequestForBuyOffer({
          offerId,
          requestingOfferId,
        });

      if (error) throw new Error(error.error);

      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
    enabled,
  });
}
