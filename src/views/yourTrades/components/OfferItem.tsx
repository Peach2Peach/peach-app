import React, { ReactElement, useContext, useMemo } from 'react'
import { IconType } from '../../../assets/icons'
import { Icon } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import { useMatchStore } from '../../../components/matches/store'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'
import { getOfferLevel, getThemeForPastTrade, isPastOffer, navigateToOffer, statusIcons } from '../utils'

type OfferItemProps = ComponentProps & {
  offer: OfferSummary
  extended?: boolean
}

// eslint-disable-next-line max-lines-per-function, complexity
export const OfferItem = ({ offer, style }: OfferItemProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const theme = useMemo(() => getThemeForPastTrade(offer), [offer])

  const navigate = () =>
    navigateToOffer({
      offer,
      navigation,
      updateOverlay,
      matchStoreSetOffer,
    })

  return isPastOffer(offer.tradeStatus) ? (
    <SummaryItem
      style={style}
      title={i18n('trade') + ' ' + offerIdToHex(offer.id as Offer['id'])}
      amount={offer.amount}
      level={theme.level as SummaryItemLevel}
      icon={<Icon id={theme.icon as IconType} style={tw`w-4 h-4`} color={theme.color} />}
      date={new Date(offer.lastModified)}
      action={{
        callback: navigate,
      }}
    />
  ) : (
    <SummaryItem
      title={i18n('trade') + ' ' + offerIdToHex(offer.id as Offer['id'])}
      amount={offer.amount}
      level={getOfferLevel(offer)}
      date={new Date(offer.lastModified)}
      action={{
        callback: navigate,
        label: i18n(`offer.requiredAction.${offer.tradeStatus}`),
        icon: statusIcons[offer.tradeStatus],
      }}
    />
  )
}
