import { useMemo } from 'react'
import { View, ViewStyle } from 'react-native'
import { Icon } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { isIOS } from '../../../utils/system'
import { useNavigateToContract } from '../hooks/useNavigateToContract'
import { getThemeForTradeItem, isPastOffer, statusIcons } from '../utils'
import { ChatMessages } from './ChatMessages'

type OfferItemProps = { contract: ContractSummary }

export const colors: Record<SummaryItemLevel, ViewStyle> = {
  APP: tw`text-primary-main`,
  SUCCESS: tw`text-success-main`,
  WARN: tw`text-black-1`,
  ERROR: tw`text-error-main`,
  INFO: tw`text-info-light`,
  DEFAULT: tw`text-black-2`,
  WAITING: tw`text-black-2`,
}

export const ContractItem = ({ contract }: OfferItemProps) => {
  const currency = contract.currency
  const price = contract.price
  const navigate = useNavigateToContract(contract)
  const tradeTheme = useMemo(() => getThemeForTradeItem(contract), [contract])
  const status = tradeTheme.level === 'WAITING' ? 'waiting' : contract.tradeStatus
  const counterparty = contract.type === 'bid' ? 'seller' : 'buyer'

  const sharedProps = {
    title: contractIdToHex(contract.id),
    amount: contract.amount,
    currency,
    price,
    level: tradeTheme.level,
    date: new Date(contract.paymentMade || contract.creationDate),
  }

  const getActionLabel = () => {
    if (isPastOffer(contract.tradeStatus)) {
      return contract.unreadMessages > 0 ? i18n('yourTrades.newMessages') : undefined
    }
    return status === 'waiting' || status === 'rateUser'
      ? i18n(`offer.requiredAction.${status}.${counterparty}`)
      : i18n(`offer.requiredAction.${status}`)
  }

  const icon = isPastOffer(contract.tradeStatus) ? (
    <Icon id={tradeTheme.icon} style={tw`w-4 h-4`} color={tradeTheme.color} />
  ) : undefined
  const theme = isPastOffer(contract.tradeStatus) ? 'light' : undefined
  const action = {
    label: getActionLabel(),
    callback: async () => await navigate(),
    icon: isPastOffer(contract.tradeStatus) ? undefined : statusIcons[status],
  }
  return (
    <View>
      <SummaryItem {...sharedProps} icon={icon} theme={theme} action={action} />

      {contract.unreadMessages > 0 && (
        <View style={tw`absolute bottom-0 right-0 mb-0.5 py-2 px-3`}>
          <ChatMessages
            messages={contract.unreadMessages}
            textStyle={[colors[tradeTheme.level], isIOS() ? tw`pt-1 pl-2px` : tw`pl-2px`]}
          />
        </View>
      )}
    </View>
  )
}
