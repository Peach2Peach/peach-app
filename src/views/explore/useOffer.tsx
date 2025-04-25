import { useQuery } from "@tanstack/react-query";
import { offerKeys } from "../../hooks/query/offerKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useOffer(offerId: string) {
  return useQuery({
    queryKey: offerKeys.offer(offerId),
    queryFn: async () => {
      const { result, error } = await peachAPI.public.offer.getOffer({
        offerId,
      });
      if (error || !result) {
        throw new Error(error?.error || "Failed to fetch offer");
      }
      return result;
    },
  });
}
