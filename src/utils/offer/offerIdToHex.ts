const radix = 16;
export const offerIdToHex = (offerId: string) =>
  `P‑${parseInt(offerId, 10).toString(radix).toUpperCase()}`;
