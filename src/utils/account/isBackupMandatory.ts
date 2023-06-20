import { MAXTRADESWITHOUTHBACKUP } from '../../constants'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getCompletedTrades } from '../tradeSummary'

export const isBackupMandatory = () => {
  const completedTrades = getCompletedTrades(useTradeSummaryStore.getState().contracts)
  return completedTrades.length >= MAXTRADESWITHOUTHBACKUP
}
