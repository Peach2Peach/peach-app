export const shouldGoToYourTradesBuy = (data: PNData) => !!data.offerId && data.type === 'offer.buyOfferExpired'
