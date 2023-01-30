import { settingsStore } from '../../../store/settingsStore'
import { shouldGoToOfferSummary } from '.'

export const getNavigationDestinationForOffer = ({
  tradeStatus,
  id: offerId,
}: OfferSummary): [string, object | undefined] => {
  if (shouldGoToOfferSummary(tradeStatus)) {
    return ['offer', { offerId }]
  }

  if (tradeStatus === 'messageSigningRequired') {
    settingsStore.getState().setPeachWalletActive(false)
    return ['signMessage', { offerId }]
  }
  if (tradeStatus === 'fundEscrow' || tradeStatus === 'escrowWaitingForConfirmation') {
    return ['fundEscrow', { offerId }]
  }
  if (/searchingForPeer|hasMatchesAvailable/u.test(tradeStatus)) {
    return ['search', { offerId }]
  }

  return ['yourTrades', undefined]
}
