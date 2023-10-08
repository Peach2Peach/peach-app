import { statusCardStyles } from '../../../components/statusCard/StatusCard'
import { isContractSummary } from './isContractSummary'
import { isError } from './isError'
import { isPastOffer } from './isPastOffer'
import { isPrioritary } from './isPrioritary'
import { isWaiting } from './isWaiting'

export const getOfferColor = (trade: TradeSummary): keyof typeof statusCardStyles.bg => {
  const { tradeStatus, type } = trade
  if (isPastOffer(tradeStatus)) {
    if (tradeStatus === 'tradeCompleted') return type === 'ask' ? 'primary' : 'success'
    return 'black'
  }
  if (['confirmCancelation', 'refundOrReviveRequired', 'refundTxSignatureRequired'].includes(tradeStatus)) return 'black'

  if (isError(tradeStatus)) return 'error'
  if (isPrioritary(tradeStatus)) return 'warning'
  if (isWaiting(type, tradeStatus)) return 'primary-mild'

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return 'warning'
  }

  return 'primary'
}
