import React, { ReactElement, useMemo } from 'react'
import { IconType } from '../../../assets/icons'
import { Icon } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'
import { useNavigateToOffer } from '../hooks/useNavigateToOffer'
import { getOfferLevel, getThemeForPastTrade, isPastOffer, statusIcons } from '../utils'

type OfferItemProps = ComponentProps & {
  offer: OfferSummary
  extended?: boolean
}

export const OfferItem = ({ offer, style }: OfferItemProps): ReactElement => {
  const navigateToOffer = useNavigateToOffer(offer)
  const theme = useMemo(() => getThemeForPastTrade(offer), [offer])

  return isPastOffer(offer.tradeStatus) ? (
    <SummaryItem
      style={style}
      title={i18n('trade') + ' ' + offerIdToHex(offer.id as Offer['id'])}
      amount={offer.amount}
      theme="light"
      level={theme.level as SummaryItemLevel}
      icon={<Icon id={theme.icon as IconType} style={tw`w-4 h-4`} color={theme.color} />}
      date={new Date(offer.creationDate)}
      action={{
        callback: navigateToOffer,
      }}
    />
  ) : (
    <SummaryItem
      title={i18n('trade') + ' ' + offerIdToHex(offer.id as Offer['id'])}
      amount={offer.amount}
      level={getOfferLevel(offer)}
      date={new Date(offer.creationDate)}
      action={{
        callback: navigateToOffer,
        label: i18n(`offer.requiredAction.${offer.tradeStatus}`),
        icon: statusIcons[offer.tradeStatus],
      }}
    />
  )
}
