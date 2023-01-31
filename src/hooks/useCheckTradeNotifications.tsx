import { useContext } from 'react'
import AppContext from '../contexts/app'
import { tradeSummaryStore } from '../store/tradeSummaryStore'
import { info } from '../utils/log'

export const statusWithRequiredAction = [
  'fundEscrow',
  'hasMatchesAvailable',
  'refundTxSignatureRequired',
  'dispute',
  'rateUser',
  'confirmCancelation',
]

export const useCheckTradeNotifications = () => {
  const [, updateAppContext] = useContext(AppContext)

  return () => {
    let notifications = 0
    const offersWithAction = tradeSummaryStore
      .getState()
      .offers.filter((offer) => statusWithRequiredAction.includes(offer.tradeStatus)).length
    const contractsWithAction = tradeSummaryStore
      .getState()
      .contracts.filter(
        (contract) => statusWithRequiredAction.includes(contract.tradeStatus) || contract.unreadMessages > 0,
      ).length
    notifications = offersWithAction + contractsWithAction

    info('notis -> ' + notifications)

    updateAppContext({
      notifications,
    })
    info(notifications)

    return notifications
  }
}
