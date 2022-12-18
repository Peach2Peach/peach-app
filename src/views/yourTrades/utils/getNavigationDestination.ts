import { isSellOffer, isBuyOffer } from '../../../utils/offer'
import { isFunded } from '../../../utils/offer/status'

const shouldGoToOffer = ({ requiredAction, status }: TradeStatus): boolean =>
  !/rate/u.test(requiredAction)
  && /offerPublished|searchingForPeer|offerCanceled|tradeCompleted|tradeCanceled/u.test(status)

export const getNavigationDestination = (
  offer: SellOffer | BuyOffer,
  offerStatus: TradeStatus,
  contract: Contract | null,
): [string, object] => {
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
      return ['search', { offer }]
    }
    return ['fundEscrow', { offer }]
  }

  if (isBuyOffer(offer) && offer.online) {
    return ['search', { offer }]
  }

  return ['yourTrades', {}]
}
