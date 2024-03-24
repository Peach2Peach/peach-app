import { useQuery } from "@tanstack/react-query";
import { FIFTEEN_SECONDS } from "../../constants";
import { getAbortWithTimeout } from "../../utils/getAbortWithTimeout";
import { peachAPI } from "../../utils/peachAPI";

type MarketFilter = {
  type: "bid" | "ask";
  escrowType?: EscrowType;
  meansOfPayment?: MeansOfPayment;
  maxPremium?: number;
  minReputation?: number;
};

export const marketKeys = {
  all: ["market"] as const,
  prices: () => [...marketKeys.all, "prices"] as const,
  stats: () => [...marketKeys.all, "stats"] as const,
  offerStats: () => [...marketKeys.stats(), "offers"] as const,
  filteredOfferStats: (filter: MarketFilter) =>
    [...marketKeys.offerStats(), filter] as const,
  pastOfferStats: () => [...marketKeys.stats(), "pastOffers"] as const,
  filteredPastOfferStats: (meansOfPayment: MeansOfPayment) =>
    [...marketKeys.pastOfferStats(), { meansOfPayment }] as const,
};

export const useMarketPrices = () =>
  useQuery({
    queryKey: marketKeys.prices(),
    queryFn: async () => {
      const { result: data, error } = await peachAPI.public.market.marketPrices(
        {
          signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
        },
      );
      if (!data)
        throw new Error(error?.error || "Error fetching market prices");
      return data;
    },
    refetchInterval: FIFTEEN_SECONDS,
  });
