export const offerIdFromHex = (offerIdHex: string) => {
  const offerId = offerIdHex.replace("P‑", "");
  return parseInt(offerId, 16).toString();
};
