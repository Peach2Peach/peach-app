import { getActionIcon } from './getActionIcon'
import { getActionLabel } from './getActionLabel'

export const getAction = (tradeSummary: TradeSummary, callback: () => void, status: TradeStatus): Action => ({
  callback,
  label: getActionLabel(tradeSummary, status),
  icon: getActionIcon(tradeSummary, status),
})
