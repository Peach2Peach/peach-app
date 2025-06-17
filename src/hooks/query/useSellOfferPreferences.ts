import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { MSINAMINUTE } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./offerKeys";

export const useSellOfferPreferences = (id?: string) =>
  useQuery({
    queryKey: offerKeys.sellPreferences(id),
    queryFn: getSellOfferPreferencesQuery,
    staleTime: MSINAMINUTE,
    enabled: !!id,
  });

async function getSellOfferPreferencesQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.sellPreferences>>) {
  const offerId = queryKey[2];
  const { result: offer, error: err } =
    await peachAPI.private.offer.getSellOfferPreferences({ offerId });
  if (err) {
    throw new Error(err.error);
  }
  if (!offer) {
    throw new Error("NOT_FOUND");
  }
  return offer;
}
