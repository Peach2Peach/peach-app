import { useMutation } from "@tanstack/react-query";
import { ESCROW_VERSION } from "../../../../peach-api";
import { interpolate } from "../../../utils/math/interpolate";
import { isSellOffer } from "../../../utils/offer/isSellOffer";
import { submitInstantTradeSignature } from "../../../utils/offer/submitInstantTradeSignature";
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

  // A fixed-price offer is priced absolutely, so it must not carry a premium.
  const hasFixedPrice = offerDraft.fixedPrice !== undefined;

  const payload = {
    // mandatory since the single-sig escrow release: the server rejects any
    // sell offer that does not ask for escrow version 2
    escrowVersion: ESCROW_VERSION,
    type: offerDraft.type,
    amount: offerDraft.amount,
    premium: hasFixedPrice ? undefined : offerDraft.premium,
    fixedPrice: offerDraft.fixedPrice,
    fixedPriceCurrency: hasFixedPrice
      ? offerDraft.fixedPriceCurrency
      : undefined,
    meansOfPayment: offerDraft.meansOfPayment,
    paymentData: offerDraft.paymentData,
    returnAddress: offerDraft.returnAddress,
    multi: offerDraft.multi,
    instantTradeCriteria,
    experienceLevelCriteria: offerDraft.experienceLevelCriteria,
  };

  const { result, error: err } =
    await peachAPI.private.offer.postSellOffer(payload);

  if (!result) {
    throw new Error(err?.error || "POST_OFFER_ERROR", {
      cause: err?.details ?? err?.message,
    });
  }

  if (Array.isArray(result) && !result.every(isSellOffer)) {
    throw new Error("NOT ALL OFFERS ARE VALID");
  }
  if (!Array.isArray(result) && !isSellOffer(result)) {
    throw new Error("OFFER IS NOT VALID");
  }

  // not awaited: the offers already exist, so neither the retries nor a
  // failure may hold up the funding flow. The offer screen re-submits it if
  // the server still has none.
  // Instant trade is decided from the paymentData that was just sent (the
  // server decides the same way from what it stored), not from the response.
  (Array.isArray(result) ? result : [result]).forEach(({ id }) =>
    submitInstantTradeSignature({ id, paymentData: payload.paymentData }),
  );

  return result;
}
