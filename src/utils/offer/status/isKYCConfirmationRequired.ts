import { isSellOffer } from '../isSellOffer'

export const isKYCConfirmationRequired = (offer: SellOffer, contract: Contract) =>
  isSellOffer(offer) && contract.kycRequired && contract.kycResponseDate === null
