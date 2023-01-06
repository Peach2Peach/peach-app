import React, { ReactElement, useContext } from 'react'
import { IconType } from '../../../assets/icons'
import { Icon } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import { useMatchStore } from '../../../components/matches/store'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'
import { navigateToOffer } from '../utils/navigateToOffer'
import { getOfferLevel, getThemePastOffer, isPastOffer, statusIcons } from '../utils/overviewUtils'

type OfferItemProps = ComponentProps & {
  offer: BuyOffer | SellOffer
  extended?: boolean
}

// eslint-disable-next-line max-lines-per-function, complexity
export const OfferItem = ({ offer, extended = true, style }: OfferItemProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const contract = offer.contractId ? getContract(offer.contractId) : null

  const currency = contract
    ? contract.currency
    : offer.prices && offer.prices[account.settings.displayCurrency]
      ? account.settings.displayCurrency
      : Object.keys(offer.meansOfPayment)[0]
  const price = contract?.price || Object(offer.prices)[currency]

  const navigate = () =>
    navigateToOffer({
      offer,
      navigation,
      updateOverlay,
      matchStoreSetOffer,
    })

  return isPastOffer(offer) ? (
    <SummaryItem
      title={i18n('trade') + ' ' + offerIdToHex(offer.id as Offer['id'])}
      amount={offer.amount}
      currency={currency as Currency}
      price={price}
      level={getThemePastOffer(offer, contract).level as SummaryItemLevel}
      icon={
        <Icon
          id={getThemePastOffer(offer, contract).icon as IconType}
          style={tw`w-3 h-3`}
          color={getThemePastOffer(offer, contract).color}
        />
      }
      date={new Date(offer.creationDate)}
    />
  ) : (
    <SummaryItem
      title={i18n('trade') + ' ' + offerIdToHex(offer.id as Offer['id'])}
      amount={offer.amount}
      currency={currency as Currency}
      price={price}
      level={getOfferLevel(offer)}
      date={new Date(offer.creationDate)}
      action={{
        callback: navigate,
        label: offer.tradeStatus,
        icon: statusIcons[offer.tradeStatus],
      }}
    />
  )
}
