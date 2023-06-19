import { Icon } from '../../../../../components'
import tw from '../../../../../styles/tailwind'
import { getThemeForTradeItem, isContractSummary, isPastOffer } from '../../../utils'
import { statusCardStyles } from '../../../../../components/statusCard/StatusCard'
import { contractIdToHex } from '../../../../../utils/contract'
import { getLevel, getAction } from '../utils'
import { offerIdToHex } from '../../../../../utils/offer'
import { getShortDateFormat } from '../../../../../utils/date/getShortDateFormat'

export const getStatusCardProps = (item: TradeSummary, navigateToOffer: () => void, navigateToContract: () => void) => {
  const tradeTheme = getThemeForTradeItem(item)
  const { tradeStatus, paymentMade, creationDate, id, amount, unreadMessages } = item
  const { price, currency } = isContractSummary(item) ? item : { price: undefined, currency: undefined }
  const status = tradeTheme.level === 'mild' ? 'waiting' : tradeStatus
  const title = isContractSummary(item) ? contractIdToHex(id) : offerIdToHex(id)
  const color = isContractSummary(item) ? getLevel(tradeTheme) : getLevel(tradeTheme, item)
  const date = isContractSummary(item) ? new Date(paymentMade || creationDate) : new Date(creationDate)
  const subtext = getShortDateFormat(date)
  const action = isContractSummary(item)
    ? getAction(item, navigateToContract, status)
    : getAction(item, navigateToOffer, tradeStatus)

  const icon = isPastOffer(item.tradeStatus) ? (
    <Icon id={tradeTheme.icon} size={16} color={statusCardStyles.border[color].borderColor} />
  ) : undefined

  return {
    title,
    icon,
    subtext,
    amount,
    price,
    currency,
    label: action.label,
    labelIcon: action?.icon && <Icon id={action.icon} size={16} color={statusCardStyles.text[color].color} />,
    onPress: action.callback,
    unreadMessages,
    color,
  }
}
