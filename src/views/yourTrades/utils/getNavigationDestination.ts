import { isSellOffer, isBuyOffer } from '../../../utils/offer'
import { isFunded } from '../../../utils/offer/status'
import { shouldGoToOffer } from './shouldGoToOffer'

export const getNavigationDestination = (
  offer: SellOffer | BuyOffer,
  offerStatus: TradeStatus,
  contract?: Contract,
): [string, object | undefined] => {
  if (shouldGoToOffer(offerStatus)) {
    return ['offer', { offer }]
  }

  if (contract) {
    if (!contract.disputeWinner && offerStatus.status === 'tradeCompleted') {
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
