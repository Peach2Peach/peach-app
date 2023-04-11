import { ReactElement, useMemo } from 'react'
import { View, ViewStyle } from 'react-native'
import { Icon } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { isIOS } from '../../../utils/system'
import { useNavigateToContract } from '../hooks/useNavigateToContract'
import { getThemeForPastTrade, isPastOffer, statusIcons } from '../utils'
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

export const ContractItem = ({ contract }: OfferItemProps): ReactElement => {
  const currency = contract.currency
  const price = contract.price
  const navigate = useNavigateToContract(contract)
  const theme = useMemo(() => getThemeForPastTrade(contract), [contract])
  const status = theme.level === 'WAITING' ? 'waiting' : contract.tradeStatus
  const counterparty = contract.type === 'bid' ? 'seller' : 'buyer'

  const sharedProps = {
    title: contractIdToHex(contract.id),
    amount: contract.amount,
    currency,
    price,
    level: theme.level,
    date: new Date(contract.paymentMade || contract.creationDate),
  }

  return (
    <View>
      {isPastOffer(contract.tradeStatus) ? (
        <SummaryItem
          {...sharedProps}
          icon={<Icon id={theme.icon} style={tw`w-4 h-4`} color={theme.color} />}
          theme="light"
          action={{
            label: contract.unreadMessages > 0 ? i18n('yourTrades.newMessages') : undefined,
            callback: async () => await navigate(),
          }}
        />
      ) : (
        <SummaryItem
          {...sharedProps}
          action={{
            callback: async () => await navigate(),
            label:
              status === 'waiting' || status === 'rateUser'
                ? i18n(`offer.requiredAction.${status}.${counterparty}`)
                : i18n(`offer.requiredAction.${status}`),
            icon: statusIcons[status],
          }}
        />
      )}
      {contract.unreadMessages > 0 && (
        <View style={tw`absolute bottom-0 right-0 mb-0.5 py-2 px-3`}>
          <ChatMessages
            messages={contract.unreadMessages}
            textStyle={[colors[theme.level], isIOS() ? tw`pt-1 pl-2px` : tw`pl-2px`]}
          />
        </View>
      )}
    </View>
  )
}
