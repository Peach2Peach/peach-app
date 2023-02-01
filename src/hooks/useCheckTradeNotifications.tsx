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
export const statusWithRequiredActionForBuyer = ['paymentRequired']
export const statusWithRequiredActionForSeller = ['confirmPaymentRequired']

export const useCheckTradeNotifications = () => {
  const setNotificationsState = useNotificationsState((state) => state.setNotifications)

  const hasRequiredAction = (offer: OfferSummary | ContractSummary) =>
    statusWithRequiredAction.includes(offer.tradeStatus)
    || (offer.type === 'bid' && statusWithRequiredActionForBuyer.includes(offer.tradeStatus))
    || (offer.type === 'ask' && statusWithRequiredActionForSeller.includes(offer.tradeStatus))

  return () => {
    let notifications = 0
    const offersWithAction = tradeSummaryStore.getState().offers.filter((offer) => hasRequiredAction(offer)).length
    const contractsWithAction = tradeSummaryStore
      .getState()
      .contracts.filter((contract) => hasRequiredAction(contract) || contract.unreadMessages > 0).length
    notifications = offersWithAction + contractsWithAction

    info('notis -> ' + notifications)

    setNotificationsState({
      notifications,
    })
    info(notifications)

    return notifications
  }
}
