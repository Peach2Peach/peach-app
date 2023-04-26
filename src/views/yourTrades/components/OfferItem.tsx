import { useMemo } from 'react'
import { Icon } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'
import { useNavigateToOffer } from '../hooks/useNavigateToOffer'
import { getOfferLevel, getThemeForTradeItem, isPastOffer, statusIcons } from '../utils'

type Props = {
  offerSummary: OfferSummary
}

export const OfferItem = ({ offerSummary }: Props) => {
  const navigateToOffer = useNavigateToOffer(offerSummary)
  const tradeTheme = useMemo(() => getThemeForTradeItem(offerSummary), [offerSummary])
  const isHistoryItem = isPastOffer(offerSummary.tradeStatus)

  const level = isHistoryItem ? tradeTheme.level : getOfferLevel(offerSummary)
  const theme = isHistoryItem ? 'light' : undefined
  const icon = isHistoryItem ? <Icon id={tradeTheme.icon} style={tw`w-4 h-4`} color={tradeTheme.color} /> : undefined
  const action = {
    callback: navigateToOffer,
    label: isHistoryItem ? undefined : i18n(`offer.requiredAction.${offerSummary.tradeStatus}`),

    icon: isHistoryItem ? undefined : statusIcons[offerSummary.tradeStatus],
  }

  return (
    <SummaryItem
      title={offerIdToHex(offerSummary.id)}
      amount={offerSummary.amount}
      level={level}
      date={new Date(offerSummary.creationDate)}
      theme={theme}
      icon={icon}
      action={action}
    />
  )
}
