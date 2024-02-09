export const shouldGoToSell = ({ offerId, type }: PNData) =>
  !!offerId && type === "offer.notFunded";
