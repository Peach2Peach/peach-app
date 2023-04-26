import { isPastOffer, statusIcons } from '../../../utils'
import { getActionLabel } from './getActionLabel'

export const getAction = (tradeSummary: TradeSummary, callback: () => void, status: TradeStatus) => ({
  callback,
  label: getActionLabel(tradeSummary, status),
  icon: isPastOffer(tradeSummary.tradeStatus) ? undefined : statusIcons[status],
})
