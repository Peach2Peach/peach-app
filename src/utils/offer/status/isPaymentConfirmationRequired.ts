import { isSellOffer } from '../isSellOffer'

export const isPaymentConfirmationRequired = (offer: SellOffer, contract: Contract) =>
  isSellOffer(offer) && contract.paymentMade !== null && !contract.paymentConfirmed
