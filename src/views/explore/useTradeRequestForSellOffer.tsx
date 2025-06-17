import { useQuery } from "@tanstack/react-query";
import { MSINASECOND, TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { tradeRequestKeys } from "../../hooks/query/tradeRequestKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useTradeRequestForSellOffer(
  offerId: string,
  requestingOfferId?: string,
) {
  return useQuery({
    queryKey: tradeRequestKeys.tradeRequestForSellOffer(
      offerId,
      requestingOfferId,
    ),
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getTradeRequestForSellOffer({
          offerId,
          requestingOfferId,
        });

      if (error) throw new Error(error.error);

      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
  });
}
