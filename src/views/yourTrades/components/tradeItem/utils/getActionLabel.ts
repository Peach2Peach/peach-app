import i18n from '../../../../../utils/i18n'
import { isContractSummary, isPastOffer } from '../../../utils'

type PartialTradeSummary = Pick<TradeSummary, 'tradeStatus' | 'unreadMessages' | 'type'> & Partial<TradeSummary>

export const getActionLabel = (tradeSummary: PartialTradeSummary, status: TradeStatus) => {
  const { tradeStatus } = tradeSummary

  if (isContractSummary(tradeSummary)) {
    const { unreadMessages, type } = tradeSummary
    const counterparty = type === 'bid' ? 'seller' : 'buyer'

    if (isPastOffer(tradeStatus)) {
      return unreadMessages > 0 ? i18n('yourTrades.newMessages') : undefined
    }
    return status === 'waiting' || status === 'rateUser'
      ? i18n(`offer.requiredAction.${status}.${counterparty}`)
      : i18n(`offer.requiredAction.${status}`)
  }

  if (isPastOffer(tradeStatus)) {
    return undefined
  }
  return i18n(`offer.requiredAction.${tradeStatus}`)
}
