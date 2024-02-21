export const getSellOfferFunding = (sellOffer: SellOffer) =>
  sellOffer.escrowType === "bitcoin"
    ? sellOffer.funding
    : sellOffer.fundingLiquid;
