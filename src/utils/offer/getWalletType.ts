export const getWalletType = (offer: BuyOffer | SellOffer | BuyOfferDraft | SellOfferDraft) =>
  offer.type === 'bid' ? 'payout' : 'refund'
