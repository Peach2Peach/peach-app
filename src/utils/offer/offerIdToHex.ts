const radix = 16
export const offerIdToHex = (offerId: Offer['id']) => `P‑${parseInt(offerId, 10).toString(radix)
  .toUpperCase()}`
