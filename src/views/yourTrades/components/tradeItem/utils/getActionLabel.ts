import i18n from '../../../../../utils/i18n'
import { useWalletState } from '../../../../../utils/wallet/walletStore'
import { isContractSummary, isPastOffer } from '../../../utils'
import { isTradeStatus } from '../../../utils/isTradeStatus'

type PartialTradeSummary = Pick<TradeSummary, 'tradeStatus' | 'unreadMessages' | 'type'> & Partial<TradeSummary>

export const getActionLabel = (tradeSummary: PartialTradeSummary, isWaiting: boolean) => {
  const { tradeStatus } = tradeSummary
  const translationStatusKey = isWaiting ? 'waiting' : tradeStatus

  if (!isTradeStatus(tradeSummary.tradeStatus)) return i18n('offer.requiredAction.unknown')

  if (isContractSummary(tradeSummary)) {
    const { unreadMessages, type, disputeWinner } = tradeSummary
    const counterparty = type === 'bid' ? 'seller' : 'buyer'
    const viewer = type === 'bid' ? 'buyer' : 'seller'

    if (isPastOffer(tradeStatus)) {
      return unreadMessages > 0 ? i18n('yourTrades.newMessages') : undefined
    }
    if (disputeWinner) {
      if (tradeStatus === 'releaseEscrow') return i18n('offer.requiredAction.releaseEscrow')
      return i18n(`offer.requiredAction.${translationStatusKey}.dispute`)
    }

    if (tradeStatus === 'payoutPending') return i18n('offer.requiredAction.payoutPending')
    if (tradeStatus === 'confirmCancelation') return i18n(`offer.requiredAction.confirmCancelation.${viewer}`)

    return isWaiting || tradeStatus === 'rateUser'
      ? i18n(`offer.requiredAction.${translationStatusKey}.${counterparty}`)
      : i18n(`offer.requiredAction.${translationStatusKey}`)
  }

  if (isPastOffer(tradeStatus)) {
    return undefined
  }

  if (
    tradeStatus === 'fundEscrow'
    && tradeSummary.id
    && useWalletState.getState().getFundMultipleByOfferId(tradeSummary.id)
  ) {
    return i18n('offer.requiredAction.fundMultipleEscrow')
  }

  return i18n(`offer.requiredAction.${tradeStatus}`)
}
