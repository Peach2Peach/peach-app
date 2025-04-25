import { QueryFunctionContext } from "@tanstack/react-query";
import { error } from "../../utils/log/error";
import { saveOffer } from "../../utils/offer/saveOffer";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./useOfferDetail";

export async function getOfferQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.detail>>) {
  const offerId = queryKey[2];
  const { result: offer, error: err } =
    await peachAPI.private.offer.getOfferDetails({ offerId });
  if (err) {
    error("Could not fetch offer information for offer", offerId, err.error);
    throw new Error(err.error);
  }
  if (!offer) {
    throw new Error("NOT_FOUND");
  }
  saveOffer(offer);
  return offer;
}
