import React, { ReactElement, useMemo } from 'react'
import { View, ViewStyle } from 'react-native'
import { Icon } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { useNavigateToContract } from '../hooks/useNavigateToContract'
import { getThemeForPastTrade, isPastOffer, statusIcons } from '../utils'
import { ChatMessages } from './ChatMessages'

type OfferItemProps = { contract: ContractSummary }

export const colors: Record<SummaryItemLevel, ViewStyle> = {
  APP: tw`text-primary-main`,
  SUCCESS: tw`text-success-main`,
  WARN: tw`text-warning-dark-2`,
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
    title: i18n('trade') + ' ' + contractIdToHex(contract.id),
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
          action={{
            callback: navigate,
            label: contract.unreadMessages > 0 ? ' ' : undefined,
            icon: contract.unreadMessages > 0 ? 'info' : undefined,
          }}
        />
      ) : (
        <SummaryItem
          {...sharedProps}
          action={{
            callback: navigate,
            label: i18n(`offer.requiredAction.${status}`, i18n(counterparty)),
            icon: statusIcons[status],
          }}
        />
      )}
      {contract.unreadMessages > 0 && (
        <View style={tw`absolute bottom-0 right-0 mb-0.5 py-2 px-3`}>
          <ChatMessages messages={contract.unreadMessages} level={theme.level} />
        </View>
      )}
    </View>
  )
}
