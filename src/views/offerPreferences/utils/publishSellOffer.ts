import { info } from "../../../utils/log/info";
import { interpolate } from "../../../utils/math/interpolate";
import { isSellOffer } from "../../../utils/offer/isSellOffer";
import { saveOffer } from "../../../utils/offer/saveOffer";
import { peachAPI } from "../../../utils/peachAPI";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import {
  CLIENT_RATING_RANGE,
  SERVER_RATING_RANGE,
} from "../../settings/profile/profileOverview/Rating";

export const publishSellOffer = async (offerDraft: SellOfferDraft) => {
  info("Posting sell offer");
  const {
    type,
    amount,
    premium,
    meansOfPayment,
    paymentData,
    returnAddress,
    multi,
  } = offerDraft;
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
    type,
    amount,
    premium,
    meansOfPayment,
    paymentData,
    returnAddress,
    multi,
    instantTradeCriteria,
  };

  const { result, error: err } =
    await peachAPI.private.offer.postSellOffer(payload);

  if (result) {
    if (!Array.isArray(result)) {
      if (isSellOffer(result)) {
        info("Posted offer", result);
        saveOffer({ ...offerDraft, ...result });

        return {
          isPublished: true,
          navigationParams: { offerId: result.id },
          errorMessage: null,
        } as const;
      }
    } else if (result.every(isSellOffer)) {
      return handleMultipleOffersPublished(result, offerDraft);
    }
  }

  return {
    isPublished: false,
    navigationParams: null,
    errorMessage: err?.error || "POST_OFFER_ERROR",
    errorDetails: err?.details,
  } as const;
};

async function handleMultipleOffersPublished(
  result: SellOffer[],
  offerDraft: SellOfferDraft,
) {
  info("Posted offers", result);

  result.forEach((offer) => saveOffer({ ...offerDraft, ...offer }));

  const internalAddress = await peachWallet.getInternalAddress();
  const diffToNextAddress = 10;
  const newInternalAddress = await peachWallet.getInternalAddress(
    internalAddress.index + diffToNextAddress,
  );
  useWalletState.getState().registerFundMultiple(
    newInternalAddress.address,
    result.map((offer) => offer.id),
  );

  return {
    isPublished: true,
    navigationParams: { offerId: result[0].id },
    errorMessage: null,
    errorDetails: undefined,
  } as const;
}
