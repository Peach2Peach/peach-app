import { isSellOffer, isBuyOffer } from '../../../utils/offer'
import { isFunded } from '../../../utils/offer/status'
import { shouldGoToOffer } from './shouldGoToOffer'

export const getNavigationDestination = (
  offer: SellOffer | BuyOffer,
  offerStatus: TradeStatus,
  contract: Contract | null,
): [string, object] => {
  if (shouldGoToOffer(offerStatus)) {
    return ['offer', { offerId: offer.id }]
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
      return ['search', {}]
    }
    return ['fundEscrow', { offer }]
  }

  if (isBuyOffer(offer) && offer.online) {
    return ['search', {}]
  }

  return ['yourTrades', {}]
}
