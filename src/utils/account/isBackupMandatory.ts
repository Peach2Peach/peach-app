import { MAXTRADESWITHOUTHBACKUP } from '../../constants'
import { tradeSummaryStore } from '../../store/tradeSummaryStore'
import { getCompletedTrades } from '../tradeSummary'

export const isBackupMandatory = () => {
  const completedTrades = getCompletedTrades(tradeSummaryStore.getState().contracts)
  return completedTrades.length >= MAXTRADESWITHOUTHBACKUP
}
