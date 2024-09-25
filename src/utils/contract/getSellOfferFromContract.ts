import { getOffer } from "../offer/getOffer";
import { isSellOffer } from "../offer/isSellOffer";
import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";

export const getSellOfferFromContract = (contractId: string) => {
  const offer = getOffer(getSellOfferIdFromContract({ id: contractId }));
  return offer && isSellOffer(offer) ? offer : null;
};
