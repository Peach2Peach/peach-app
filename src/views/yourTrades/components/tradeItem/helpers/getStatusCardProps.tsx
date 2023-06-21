import { Icon } from '../../../../../components'
import { getThemeForTradeItem, isContractSummary, isPastOffer } from '../../../utils'
import { statusCardStyles } from '../../../../../components/statusCard/StatusCard'
import { contractIdToHex } from '../../../../../utils/contract'
import { offerIdToHex } from '../../../../../utils/offer'
import { getShortDateFormat } from '../../../../../utils/date/getShortDateFormat'
import { getActionLabel, getActionIcon } from '../utils'

export const getStatusCardProps = (item: TradeSummary) => {
  const { tradeStatus, paymentMade, creationDate, id } = item
  const isContract = isContractSummary(item)

  const { color, iconId } = getThemeForTradeItem(item)

  const title = isContract ? contractIdToHex(id) : offerIdToHex(id)

  const date = new Date(paymentMade || creationDate)
  const subtext = getShortDateFormat(date)

  const isWaiting = color === 'primary-mild' && isContract
  const label = getActionLabel(item, isWaiting)
  const labelIconId = getActionIcon(item, isWaiting)
  const labelIcon = labelIconId && <Icon id={labelIconId} size={17} color={statusCardStyles.text[color].color} />

  const icon = isPastOffer(tradeStatus) ? (
    <Icon id={iconId} size={16} color={statusCardStyles.border[color].borderColor} />
  ) : undefined

  return {
    title,
    icon,
    subtext,
    label,
    labelIcon,
    color,
  }
}
