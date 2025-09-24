import { useQuery } from "@tanstack/react-query";
import { TEN_SECONDS } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./useOfferDetail";

export const useOfferSummaries = (enabled = true) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: offerKeys.summaries(),
    queryFn: getOfferSummariesQuery,
    enabled,
    refetchInterval: TEN_SECONDS,
    refetchOnWindowFocus: true,
  });

  return {
    offers: data || [],
    isLoading,
    isRefetching,
    error,
    refetch,
  };
};

export async function getOfferSummariesQuery() {
  const { result: offers, error } =
    await peachAPI.private.offer.getOfferSummaries();

  if (error?.error || !offers)
    throw new Error(error?.error || "Unable to fetch offers");
  return offers.map((offer) => ({
    ...offer,
    creationDate: new Date(offer.creationDate),
    lastModified: new Date(offer.lastModified),
  }));
}
