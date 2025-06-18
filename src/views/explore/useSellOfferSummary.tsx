import { useQuery } from "@tanstack/react-query";
import { offerKeys } from "../../hooks/query/offerKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useSellOfferSummary(
  offerId: string,
  requestingOfferId?: string,
) {
  return useQuery({
    queryKey: offerKeys.publicSellSummary(offerId, requestingOfferId),
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getSellOfferSummary({
          offerId,
          requestingOfferId,
        });
      if (error) throw error;
      return result;
    },
  });
}
