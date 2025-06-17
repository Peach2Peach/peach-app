import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { MSINAMINUTE } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./offerKeys";

export const useBuyOfferPreferences = (id?: string) =>
  useQuery({
    queryKey: offerKeys.buyPreferences(id),
    queryFn: getBuyOfferPreferencesQuery,
    staleTime: MSINAMINUTE,
    enabled: !!id,
  });

async function getBuyOfferPreferencesQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.buyPreferences>>) {
  const offerId = queryKey[2];
  const { result: offer, error: err } =
    await peachAPI.private.offer.getBuyOfferPreferences({ offerId });
  if (err) {
    throw new Error(err.error);
  }
  if (!offer) {
    throw new Error("NOT_FOUND");
  }
  return offer;
}
