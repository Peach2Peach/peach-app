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
  const theme = useMemo(() => getThemeForTradeItem(offerSummary), [offerSummary])

  return (
    <SummaryItem
      title={offerIdToHex(offerSummary.id)}
      amount={offerSummary.amount}
      level={isPastOffer(offerSummary.tradeStatus) ? theme.level : getOfferLevel(offerSummary)}
      date={new Date(offerSummary.creationDate)}
      theme={isPastOffer(offerSummary.tradeStatus) ? 'light' : undefined}
      icon={
        isPastOffer(offerSummary.tradeStatus) ? (
          <Icon id={theme.icon} style={tw`w-4 h-4`} color={theme.color} />
        ) : undefined
      }
      action={{
        callback: navigateToOffer,
        label: isPastOffer(offerSummary.tradeStatus)
          ? undefined
          : i18n(`offer.requiredAction.${offerSummary.tradeStatus}`),
        icon: isPastOffer(offerSummary.tradeStatus) ? undefined : statusIcons[offerSummary.tradeStatus],
      }}
    />
  )
}
