/**
 * @description Method to convert offer id to hex
 * @param offerId offer id
 * @returns hex representation of offer id
 */
export const offerIdToHex = (offerId: Offer['id']) =>
  'P-'
  + parseInt(offerId, 10)
    .toString(16)
    .toUpperCase()