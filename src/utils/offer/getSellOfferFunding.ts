import { SellOffer } from "../../../peach-api/src/@types/offer";

export const getSellOfferFunding = (sellOffer: SellOffer) =>
  sellOffer.escrowType === "bitcoin"
    ? sellOffer.funding
    : sellOffer.fundingLiquid;
