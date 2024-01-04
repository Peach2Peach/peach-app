import { IconType } from '../../../../../assets/icons'
import { isContractSummary, isPastOffer, statusIcons } from '../../../utils'
import { isTradeStatus } from '../../../utils/isTradeStatus'

export const getActionIcon = (
  tradeSummary: Pick<TradeSummary, 'tradeStatus'>,
  isWaiting: boolean,
): IconType | undefined => {
  if (isPastOffer(tradeSummary.tradeStatus)) {
    return undefined
  }
  if (isContractSummary(tradeSummary) && tradeSummary.disputeWinner) {
    if (tradeSummary.tradeStatus === 'releaseEscrow') return 'sell'
    return 'alertOctagon'
  }

  if (tradeSummary.tradeStatus === 'payoutPending') return statusIcons.payoutPending

  if (!isTradeStatus(tradeSummary.tradeStatus)) return 'refreshCw'

  return statusIcons[isWaiting ? 'waiting' : tradeSummary.tradeStatus]
}
