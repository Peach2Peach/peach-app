import { useQuery } from "@tanstack/react-query";
import { offerKeys } from "../../hooks/query/offerKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useBuyOfferSummary(
  offerId: string,
  requestingOfferId?: string,
) {
  return useQuery({
    queryKey: offerKeys.publicBuySummary(offerId, requestingOfferId),
    queryFn: async () => {
      const { result, error } = await peachAPI.private.offer.getBuyOfferSummary(
        { offerId },
      );
      if (error) throw error;
      return result;
    },
  });
}
