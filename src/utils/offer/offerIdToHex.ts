export const offerIdToHex = (offerId: Offer['id']) => 'P‑' + parseInt(offerId, 10).toString(16)
  .toUpperCase()
