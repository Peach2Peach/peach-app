import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./useOfferDetail";

export const useOfferSummaries = (enabled = true) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: offerKeys.summaries(),
    queryFn: getOfferSummariesQuery,
    enabled,
  });

  return { offers: data || [], isLoading, error, refetch };
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
