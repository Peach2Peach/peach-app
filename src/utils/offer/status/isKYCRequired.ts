import { isBuyOffer } from '../isBuyOffer'

export const isKYCRequired = (offer: BuyOffer, contract: Contract) =>
  isBuyOffer(offer) && contract.kycRequired && !contract.kycConfirmed && contract.kycResponseDate !== null
