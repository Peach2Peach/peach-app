import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

export function useBuyOfferSummary(offerId: string) {
  return useQuery({
    queryKey: ["buyOfferSummary", offerId],
    queryFn: async () => {
      const { result, error } = await peachAPI.private.offer.getBuyOfferSummary(
        { offerId },
      );
      if (error) throw error;
      return result;
    },
  });
}
