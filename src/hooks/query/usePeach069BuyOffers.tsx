import { useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";

export const useOwnPeach069BuyOffers = (enabled = true) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ["peach069OwnBuyOffers"],
    queryFn: getOwnPeach069BuyOffersQuery,
    enabled,
    refetchInterval: FIVE_SECONDS,
    refetchOnWindowFocus: true,
  });

  return {
    buyOffers: data || [],
    isLoading,
    isRefetching,
    error,
    refetch,
  };
};

export async function getOwnPeach069BuyOffersQuery() {
  const { result: buyOffers, error } =
    await peachAPI.private.peach069.getBuyOffers({ ownOffers: true });

  if (error?.error || buyOffers === undefined)
    throw new Error(error?.error || "Error fetching contract summaries");

  return buyOffers.map((buyOffer) => ({
    ...buyOffer,
    creationDate: new Date(buyOffer.creationDate),
    lastModified: new Date(buyOffer.creationDate),
    paymentMade: undefined,
  }));
}
