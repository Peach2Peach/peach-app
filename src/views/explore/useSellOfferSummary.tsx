import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

export function useSellOfferSummary(offerId: string) {
  return useQuery({
    queryKey: ["sellOfferSummary", offerId],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getSellOfferSummary({ offerId });
      if (error) throw error;
      return result;
    },
  });
}
