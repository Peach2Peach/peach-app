import { isSellOffer, isBuyOffer } from '../../../utils/offer'
import { isFunded } from '../../../utils/offer/status'
import { shouldGoToOffer } from './shouldGoToOffer'

export const getNavigationDestination = (
  offer: SellOffer | BuyOffer,
  contract?: Contract,
): [string, object | undefined] => {
  if (shouldGoToOffer(offer.tradeStatus)) {
    return ['offer', { offer }]
  }

  if (contract) {
    if (!contract.disputeWinner && offer.tradeStatus === 'tradeCompleted') {
      return ['tradeComplete', { contract }]
    }
    return ['contract', { contractId: contract.id }]
  }

  if (isSellOffer(offer)) {
    if (offer.returnAddressRequired) {
      return ['setReturnAddress', { offer }]
    }
    if (isFunded(offer)) {
      return ['search', undefined]
    }
    return ['fundEscrow', { offer }]
  }

  if (isBuyOffer(offer) && offer.online) {
    return ['search', undefined]
  }

  return ['yourTrades', undefined]
}
