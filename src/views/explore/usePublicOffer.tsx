import { useQuery } from "@tanstack/react-query";
import { offerKeys } from "../../hooks/query/offerKeys";
import { peachAPI } from "../../utils/peachAPI";

export function usePublicOffer(offerId: string) {
  return useQuery({
    queryKey: offerKeys.publicOffer(offerId),
    queryFn: async () => {
      const { result, error } = await peachAPI.public.offer.getPublicOffer({
        offerId,
      });
      if (error || !result) {
        throw new Error(error?.error || "Failed to fetch offer");
      }
      return result;
    },
  });
}
