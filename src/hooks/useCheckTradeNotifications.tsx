import { useCallback } from 'react'
import { useNotificationsState } from '../components/footer/notificationsStore'
import { tradeSummaryStore } from '../store/tradeSummaryStore'
import { info } from '../utils/log'
import { hasDoubleMatched } from '../views/yourTrades/utils'

export const statusWithRequiredAction: TradeStatus[] = [
  'fundEscrow',
  'fundingAmountDifferent',
  'hasMatchesAvailable',
  'messageSigningRequired',
  'refundTxSignatureRequired',
  'dispute',
  'rateUser',
  'confirmCancelation',
]
export const statusWithRequiredActionForBuyer: TradeStatus[] = ['paymentRequired']
export const statusWithRequiredActionForSeller: TradeStatus[] = ['confirmPaymentRequired']

const hasRequiredAction = (offer: OfferSummary | ContractSummary) =>
  statusWithRequiredAction.includes(offer.tradeStatus)
  || (offer.type === 'bid' && statusWithRequiredActionForBuyer.includes(offer.tradeStatus))
  || (offer.type === 'ask' && statusWithRequiredActionForSeller.includes(offer.tradeStatus))

export const useCheckTradeNotifications = () => {
  const setNotificationsState = useNotificationsState((state) => state.setNotifications)

  const checkTradeNotifications = useCallback(() => {
    const { offers, contracts } = tradeSummaryStore.getState()
    const offersWithAction = offers
      .filter(({ tradeStatus }) => !hasDoubleMatched(tradeStatus))
      .filter((offer) => hasRequiredAction(offer)).length
    const contractsWithAction = contracts.filter(
      (contract) => hasRequiredAction(contract) || contract.unreadMessages > 0,
    ).length
    const notifications = offersWithAction + contractsWithAction

    info('checkTradeNotifications', notifications)

    setNotificationsState({
      notifications,
    })

    return notifications
  }, [setNotificationsState])

  return checkTradeNotifications
}
