import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

export const useOwnPeach069BuyOffers = (enabled = true) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ["peach069OwnBuyOffers"],
    queryFn: getOwnPeach069BuyOffersQuery,
    enabled,
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

  if (error?.error || !buyOffers)
    throw new Error(error?.error || "Error fetching contract summaries");

  return buyOffers.map((buyOffer) => ({
    ...buyOffer,
    creationDate: new Date(buyOffer.creationDate),
    lastModified: new Date(buyOffer.creationDate),
    paymentMade: undefined,
  }));
}
