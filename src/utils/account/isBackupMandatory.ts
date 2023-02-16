import { MAXTRADESWITHOUTHBACKUP } from '../../constants'
import { tradeSummaryStore } from '../../store/tradeSummaryStore'
import { getCompletedTrades } from '../tradeSummary'
import { account } from './account'

export const isBackupMandatory = () => {
  if (account.settings.lastBackupDate) return false
  const completedTrades = getCompletedTrades(tradeSummaryStore.getState().contracts)
  return completedTrades.length >= MAXTRADESWITHOUTHBACKUP
}
