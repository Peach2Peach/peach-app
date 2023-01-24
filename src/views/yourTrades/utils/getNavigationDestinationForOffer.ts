import { settingsStore } from '../../../store/settingsStore'
import { shouldGoToOfferSummary } from '.'

export const getNavigationDestinationForOffer = (offer: OfferSummary): [string, object | undefined] => {
  if (shouldGoToOfferSummary(offer.tradeStatus)) {
    return ['offer', { offerId: offer.id }]
  }

  if (offer.tradeStatus === 'messageSigningRequired') {
    settingsStore.getState().setPeachWalletActive(false)
    return ['signMessage', { offerId: offer.id }]
  }
  if (offer.tradeStatus === 'fundEscrow' || offer.tradeStatus === 'escrowWaitingForConfirmation') {
    return ['fundEscrow', { offerId: offer.id }]
  }
  if (/searchingForPeer|hasMatchesAvailable/u.test(offer.tradeStatus)) {
    return ['search', undefined]
  }

  return ['yourTrades', undefined]
}
