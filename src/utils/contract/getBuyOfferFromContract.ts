import { getOffer } from "../offer/getOffer";
import { isBuyOffer } from "../offer/isBuyOffer";
import { getBuyOfferIdFromContract } from "./getBuyOfferIdFromContract";

export const getBuyOfferFromContract = async (contract: Contract) => {
  const offer = await getOffer(getBuyOfferIdFromContract(contract));
  return offer && isBuyOffer(offer) ? offer : null;
};
