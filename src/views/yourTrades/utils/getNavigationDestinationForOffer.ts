import { shouldGoToOfferSummary } from '.'

export const getNavigationDestinationForOffer = ({
  tradeStatus,
  id: offerId,
}: OfferSummary): [string, object | undefined] => {
  if (shouldGoToOfferSummary(tradeStatus)) {
    return ['offer', { offerId }]
  }

  if (tradeStatus === 'messageSigningRequired') {
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
