import { useMutation } from "@tanstack/react-query";
import { interpolate } from "../../../utils/math/interpolate";
import { isSellOffer } from "../../../utils/offer/isSellOffer";
import { peachAPI } from "../../../utils/peachAPI";
import {
  CLIENT_RATING_RANGE,
  SERVER_RATING_RANGE,
} from "../../settings/profile/profileOverview/Rating";

export function usePostSellOffer() {
  return useMutation({
    mutationFn: postSellOffer,
  });
}

async function postSellOffer(offerDraft: SellOfferDraft) {
  const instantTradeCriteria = offerDraft.instantTradeCriteria
    ? {
        ...offerDraft.instantTradeCriteria,
        minReputation: interpolate(
          offerDraft.instantTradeCriteria.minReputation,
          CLIENT_RATING_RANGE,
          SERVER_RATING_RANGE,
        ),
      }
    : undefined;

  const payload = {
    type: offerDraft.type,
    amount: offerDraft.amount,
    premium: offerDraft.premium,
    meansOfPayment: offerDraft.meansOfPayment,
    paymentData: offerDraft.paymentData,
    returnAddress: offerDraft.returnAddress,
    multi: offerDraft.multi,
    instantTradeCriteria,
  };

  const { result, error: err } =
    await peachAPI.private.offer.postSellOffer(payload);

  if (!result) {
    throw new Error(err?.error || "POST_OFFER_ERROR");
  }

  if (Array.isArray(result) && !result.every(isSellOffer)) {
    throw new Error("NOT ALL OFFERS ARE VALID");
  }
  if (!Array.isArray(result) && !isSellOffer(result)) {
    throw new Error("OFFER IS NOT VALID");
  }

  return result;
}
