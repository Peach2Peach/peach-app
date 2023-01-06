import React, { ReactElement, useContext, useMemo } from 'react'
import { IconType } from '../../../assets/icons'
import { Icon } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'
import { getOfferLevel, getThemeForPastTrade, isPastOffer, navigateToContract, statusIcons } from '../utils'

type OfferItemProps = ComponentProps & {
  contract: ContractSummary
}

// eslint-disable-next-line max-lines-per-function, complexity
export const ContractItem = ({ contract, style }: OfferItemProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const currency = contract.currency
  const price = contract.price

  const offerLevel = getOfferLevel(contract.type, contract.tradeStatus)
  const status = offerLevel === 'WAITING' ? 'waiting' : contract.tradeStatus
  const counterparty = contract.type === 'bid' ? 'seller' : 'buyer'
  const theme = useMemo(() => getThemeForPastTrade(contract), [contract])

  const navigate = () =>
    navigateToContract({
      contract,
      navigation,
      updateOverlay,
    })

  return isPastOffer(contract.tradeStatus) ? (
    <SummaryItem
      style={style}
      title={i18n('trade') + ' ' + offerIdToHex(contract.offerId)}
      amount={contract.amount}
      currency={currency}
      price={price}
      level={theme.level as SummaryItemLevel}
      icon={<Icon id={theme.icon as IconType} style={tw`w-4 h-4`} color={theme.color} />}
      date={new Date(contract.lastModified)}
      action={{
        callback: navigate,
      }}
    />
  ) : (
    <SummaryItem
      title={i18n('trade') + ' ' + offerIdToHex(contract.offerId as Offer['id'])}
      amount={contract.amount}
      currency={currency}
      price={price}
      level={offerLevel}
      date={new Date(contract.lastModified)}
      action={{
        callback: navigate,
        label: i18n(`offer.requiredAction.${status}`, i18n(counterparty)),
        icon: statusIcons[status],
      }}
    />
  )
}
