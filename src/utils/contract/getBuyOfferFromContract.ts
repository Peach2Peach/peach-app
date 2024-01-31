import { getOffer } from "../offer/getOffer";
import { getBuyOfferIdFromContract } from "./getBuyOfferIdFromContract";

export const getBuyOfferFromContract = (contract: Contract) =>
  getOffer(getBuyOfferIdFromContract(contract)) as BuyOffer;
