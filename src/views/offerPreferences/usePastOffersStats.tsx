import { useQuery } from "@tanstack/react-query";
import { marketKeys } from "../../hooks/query/useMarketPrices";
import { peachAPI } from "../../utils/peachAPI";

export function usePastOffersStats({
  meansOfPayment,
}: {
  meansOfPayment: MeansOfPayment;
}) {
  return useQuery({
    queryKey: marketKeys.filteredPastOfferStats(meansOfPayment),
    queryFn: async (context) => {
      const preferences = context.queryKey[3];
      const { result } =
        await peachAPI.public.market.getPastOffersStats(preferences);
      if (!result) throw new Error("no past offers stats found");
      return result;
    },
    placeholderData: (data) => {
      if (data) return data;
      return {
        avgPremium: 0,
      };
    },
  });
}
