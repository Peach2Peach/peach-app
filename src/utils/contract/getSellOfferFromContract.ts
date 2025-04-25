import { getOffer } from "../offer/getOffer";
import { isSellOffer } from "../offer/isSellOffer";
import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";

export const getSellOfferFromContract = async (
  contract: Pick<Contract, "id">,
) => {
  const offer = await getOffer(getSellOfferIdFromContract(contract));
  return offer && isSellOffer(offer) ? offer : null;
};
