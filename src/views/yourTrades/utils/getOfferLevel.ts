import { isContractSummary } from './isContractSummary'
import { isError } from './isError'
import { isPastOffer } from './isPastOffer'
import { isPrioritary } from './isPrioritary'
import { isWaiting } from './isWaiting'

export const getOfferLevel = (trade: TradeSummary): SummaryItemLevel => {
  if (isPastOffer(trade.tradeStatus)) {
    if (trade.tradeStatus === 'tradeCanceled') return 'DEFAULT'
    if (trade.tradeStatus === 'offerCanceled') return 'DEFAULT'

    if (trade.type === 'ask') return 'APP'
    if (trade.type === 'bid') return 'SUCCESS'
  }
  if (isError(trade.tradeStatus)) return 'ERROR'
  if (isPrioritary(trade.tradeStatus)) return 'WARN'
  if (isWaiting(trade.type, trade.tradeStatus)) return 'WAITING'

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return 'WARN'
    if (trade.tradeStatus === 'tradeCanceled') return 'DEFAULT'
  }

  return 'APP'
}
