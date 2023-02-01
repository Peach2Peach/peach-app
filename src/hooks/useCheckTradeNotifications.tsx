import { useNotificationsState } from '../components/footer/notificationsStore'
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
  const setNotificationsState = useNotificationsState((state) => state.setNotifications)

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

    setNotificationsState({
      notifications,
    })
    info(notifications)

    return notifications
  }
}
