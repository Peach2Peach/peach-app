import { ContractSummary } from '../../../../../peach-api/src/@types/contract'
import { OfferSummary } from '../../../../../peach-api/src/@types/offer'
import { IconType } from '../../../../assets/icons'
import { Icon } from '../../../../components/Icon'
import { statusCardStyles } from '../../../../components/statusCard/statusCardStyles'
import tw from '../../../../styles/tailwind'
import { contractIdToHex } from '../../../../utils/contract/contractIdToHex'
import { getShortDateFormat } from '../../../../utils/date/getShortDateFormat'
import i18n from '../../../../utils/i18n'
import { getOffer } from '../../../../utils/offer/getOffer'
import { offerIdToHex } from '../../../../utils/offer/offerIdToHex'
import { useWalletState } from '../../../../utils/wallet/walletStore'
import { getThemeForTradeItem, isContractSummary, isPastOffer, statusIcons } from '../../utils'
import { isTradeStatus } from '../../utils/isTradeStatus'

export const getStatusCardProps = (item: OfferSummary | ContractSummary) => {
  const isContract = isContractSummary(item)

  const { color, iconId } = getThemeForTradeItem(item)
  const isWaiting = color === 'primary-mild' && isContract
  const labelIconId = getActionIcon(item, isWaiting)

  return {
    title: getTitle(item),
    icon: isPastOffer(item.tradeStatus) ? (
      <Icon id={iconId} size={16} color={tw.color(statusCardStyles.border[color])} />
    ) : undefined,
    subtext: getSubtext(item),
    label: getActionLabel(item, isWaiting),
    labelIcon: labelIconId && <Icon id={labelIconId} size={17} color={tw.color(statusCardStyles.text[color])} />,
    color,
    replaced: 'newTradeId' in item && !!item.newTradeId,
  }
}

function getActionLabel (tradeSummary: OfferSummary | ContractSummary, isWaiting: boolean) {
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

function getActionIcon (
  tradeSummary: Pick<OfferSummary | ContractSummary, 'tradeStatus'>,
  isWaiting: boolean,
): IconType | undefined {
  if (isPastOffer(tradeSummary.tradeStatus)) {
    return undefined
  }
  if (isContractSummary(tradeSummary) && tradeSummary.disputeWinner) {
    if (tradeSummary.tradeStatus === 'releaseEscrow') return 'sell'
    return 'alertOctagon'
  }

  if (tradeSummary.tradeStatus === 'payoutPending') return statusIcons.payoutPending

  if (!isTradeStatus(tradeSummary.tradeStatus)) return 'refreshCw'

  return statusIcons[isWaiting ? 'waiting' : tradeSummary.tradeStatus]
}

function getTitle (item: OfferSummary | ContractSummary) {
  const title = isContractSummary(item) ? contractIdToHex(item.id) : offerIdToHex(item.id)
  if ('newTradeId' in item && !!item.newTradeId) {
    return `${title} (${i18n('offer.canceled')})`
  }
  return title
}

function getSubtext (item: OfferSummary | ContractSummary) {
  const date = new Date('paymentMade' in item ? item.paymentMade || item.creationDate : item.creationDate)
  const newOfferId = 'newTradeId' in item && !!item.newTradeId ? item.newTradeId : undefined
  const newContractId = newOfferId ? getOffer(newOfferId)?.contractId : undefined
  const newTradeId = newContractId ? contractIdToHex(newContractId) : newOfferId ? offerIdToHex(newOfferId) : undefined

  return newTradeId || getShortDateFormat(date)
}
