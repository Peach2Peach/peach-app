import { getEscrowWallet } from './getEscrowWallet'
import { getWallet } from './getWallet'

/**
 * @deprecated
 */
export const getEscrowWalletForOffer = (offer: SellOffer) => getEscrowWallet(getWallet(), offer.oldOfferId || offer.id)
