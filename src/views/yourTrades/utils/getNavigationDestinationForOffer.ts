import { shouldGoToOfferSummary } from '.'

export const getNavigationDestinationForOffer = ({
  tradeStatus,
  id: offerId,
}: {
  tradeStatus: OfferSummary['tradeStatus']
  id: OfferSummary['id']
}): [string, object | undefined] => {
  if (shouldGoToOfferSummary(tradeStatus)) {
    return ['offer', { offerId }]
  }
  if (tradeStatus === 'refundAddressRequired') {
    return ['setRefundWallet', { offerId }]
  }

  if (tradeStatus === 'fundEscrow' || tradeStatus === 'escrowWaitingForConfirmation') {
    return ['fundEscrow', { offerId }]
  }
  if (/searchingForPeer|hasMatchesAvailable/u.test(tradeStatus)) {
    return ['search', { offerId }]
  }

  return ['yourTrades', undefined]
}
