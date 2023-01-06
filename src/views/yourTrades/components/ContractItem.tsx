import React, { ReactElement, useContext, useMemo } from 'react'
import { View, ViewStyle } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Icon, Text } from '../../../components'
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

type ChatMessagesProps = {
  messages: number
  level: SummaryItemLevel
}

const colors: Record<SummaryItemLevel, ViewStyle> = {
  APP: tw`text-primary-main`,
  SUCCESS: tw`text-success-main`,
  WARN: tw`text-warning-main`,
  ERROR: tw`text-error-main`,
  INFO: tw`text-info-light`,
  DEFAULT: tw`text-black-2`,
  WAITING: tw`text-black-2`,
}

const ChatMessages = ({ messages, level }: ChatMessagesProps): ReactElement => (
  <View>
    <Icon id="messageFull" style={tw`w-6 h-6`} color={tw`text-primary-background-light`.color} />
    <Text style={[tw`absolute bottom-0 right-0 w-6 font-bold text-center`, colors[level]]}>{messages}</Text>
  </View>
)

// eslint-disable-next-line max-lines-per-function, complexity
export const ContractItem = ({ contract, style }: OfferItemProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const currency = contract.currency
  const price = contract.price

  const theme = useMemo(() => getThemeForPastTrade(contract), [contract])
  const status = theme.level === 'WAITING' ? 'waiting' : contract.tradeStatus
  const counterparty = contract.type === 'bid' ? 'seller' : 'buyer'

  const navigate = () =>
    navigateToContract({
      contract,
      navigation,
      updateOverlay,
    })

  return (
    <View>
      {isPastOffer(contract.tradeStatus) ? (
        <SummaryItem
          style={style}
          title={i18n('trade') + ' ' + offerIdToHex(contract.offerId)}
          amount={contract.amount}
          currency={currency}
          price={price}
          level={theme.level as SummaryItemLevel}
          icon={<Icon id={theme.icon as IconType} style={tw`w-4 h-4`} color={theme.color} />}
          date={new Date(contract.creationDate)}
          action={{
            callback: navigate,
            label: contract.messages > 0 ? ' ' : undefined,
            icon: contract.messages > 0 ? 'info' : undefined,
          }}
        />
      ) : (
        <SummaryItem
          title={i18n('trade') + ' ' + offerIdToHex(contract.offerId as Offer['id'])}
          amount={contract.amount}
          currency={currency}
          price={price}
          level={theme.level}
          date={new Date(contract.paymentMade || contract.creationDate)}
          action={{
            callback: navigate,
            label: i18n(`offer.requiredAction.${status}`, i18n(counterparty)),
            icon: statusIcons[status],
          }}
        />
      )}
      {contract.messages > 0 && (
        <View style={tw`absolute bottom-0 right-0 mb-0.5 py-2 px-3`}>
          <ChatMessages messages={contract.messages} level={theme.level as SummaryItemLevel} />
        </View>
      )}
    </View>
  )
}
