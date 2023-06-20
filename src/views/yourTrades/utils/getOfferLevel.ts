import { statusCardStyles } from '../../../components/statusCard/StatusCard'
import { isContractSummary } from './isContractSummary'
import { isError } from './isError'
import { isPastOffer } from './isPastOffer'
import { isPrioritary } from './isPrioritary'
import { isWaiting } from './isWaiting'

export const getOfferLevel = (trade: TradeSummary): keyof typeof statusCardStyles.bg => {
  if (isPastOffer(trade.tradeStatus)) {
    if (trade.tradeStatus === 'tradeCanceled') return 'gray'
    if (trade.tradeStatus === 'offerCanceled') return 'gray'

    if (trade.type === 'ask') return 'orange'
    if (trade.type === 'bid') return 'green'
  }
  if (trade.tradeStatus === 'confirmCancelation') return 'gray'

  if (isError(trade.tradeStatus)) return 'red'
  if (isPrioritary(trade.tradeStatus)) return 'yellow'
  if (isWaiting(trade.type, trade.tradeStatus)) return 'mild'

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return 'yellow'
  }

  return 'orange'
}
