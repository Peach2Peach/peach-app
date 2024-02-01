import { error } from "../log/error";
import { info } from "../log/info";
import { peachAPI } from "../peachAPI";
import { isSellOffer } from "./isSellOffer";
import { saveOffer } from "./saveOffer";

export const cancelAndSaveOffer = async (offer: BuyOffer | SellOffer) => {
  if (!offer.id) return [null, { error: "GENERAL_ERROR" }] as const;

  const { result, error: err } = await peachAPI.private.offer.cancelOffer({
    offerId: offer.id,
  });
  if (result) {
    info("Cancel offer: ", JSON.stringify(result));
    if (isSellOffer(offer)) {
      saveOffer({
        ...offer,
        online: false,
        funding: {
          ...offer.funding,
          status: "CANCELED",
        },
      });
    } else {
      saveOffer({ ...offer, online: false });
    }
  } else if (err) {
    error("Error", err);
  }

  return [result, err] as const;
};
