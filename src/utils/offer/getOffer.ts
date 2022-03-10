import { account } from '../account'

/**
  * @description Method to get saved offer
  * @param id offer id
  * @returns offer
  */
export const getOffer = (id: string): SellOffer|BuyOffer|undefined => account.offers.find(c => c.id === id)