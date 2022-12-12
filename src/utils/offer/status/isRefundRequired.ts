import { isSellOffer } from '../isSellOffer'

export const isRefundRequired = (offer: SellOffer | BuyOffer, contract: Contract) =>
  isSellOffer(offer)
  && contract.disputeWinner === 'seller'
  && !offer.newOfferId
  && !offer.refunded
  && !contract.releaseTxId
