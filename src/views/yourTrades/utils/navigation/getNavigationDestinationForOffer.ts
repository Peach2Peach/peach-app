import { shouldGoToFundEscrow } from './shouldGoToFundEscrow'
import { shouldGoToSearch } from './shouldGoToSearch'
import { shouldGoToWrongFundingAmount } from './shouldGoToWrongFundingAmount'

export const getNavigationDestinationForOffer = ({
  tradeStatus,
  id: offerId,
}: {
  tradeStatus: OfferSummary['tradeStatus']
  id: OfferSummary['id']
}) => {
  if (tradeStatus === 'offerCanceled') {
    return ['offer', { offerId }] as const
  }

  if (shouldGoToFundEscrow(tradeStatus)) return ['fundEscrow', { offerId }] as const
  if (shouldGoToSearch(tradeStatus)) return ['search', { offerId }] as const
  if (shouldGoToWrongFundingAmount(tradeStatus)) return ['wrongFundingAmount', { offerId }] as const

  return ['home', { screen: 'yourTrades' }] as const
}
