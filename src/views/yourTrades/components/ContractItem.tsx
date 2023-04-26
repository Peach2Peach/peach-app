import { View, ViewStyle } from 'react-native'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { isIOS } from '../../../utils/system'
import { useNavigateToContract } from '../hooks/useNavigateToContract'
import { isPastOffer, statusIcons } from '../utils'
import { TradeTheme } from '../utils/getThemeForTradeItem'
import { ChatMessages } from './ChatMessages'

export const colors: Record<SummaryItemLevel, ViewStyle> = {
  APP: tw`text-primary-main`,
  SUCCESS: tw`text-success-main`,
  WARN: tw`text-black-1`,
  ERROR: tw`text-error-main`,
  INFO: tw`text-info-light`,
  DEFAULT: tw`text-black-2`,
  WAITING: tw`text-black-2`,
}

type Props = {
  contractSummary: ContractSummary
  tradeTheme: TradeTheme
  icon: JSX.Element | undefined
}

export const ContractItem = ({ contractSummary, tradeTheme, icon }: Props) => {
  const { currency, price, amount, tradeStatus, type, paymentMade, creationDate, id } = contractSummary
  const unreadMessages = 3
  const navigateToContract = useNavigateToContract(contractSummary)
  const status = tradeTheme.level === 'WAITING' ? 'waiting' : tradeStatus
  const counterparty = type === 'bid' ? 'seller' : 'buyer'

  const getActionLabel = () => {
    if (isPastOffer(tradeStatus)) {
      return unreadMessages > 0 ? i18n('yourTrades.newMessages') : undefined
    }
    return status === 'waiting' || status === 'rateUser'
      ? i18n(`offer.requiredAction.${status}.${counterparty}`)
      : i18n(`offer.requiredAction.${status}`)
  }

  const theme = isPastOffer(tradeStatus) ? 'light' : undefined
  const action = {
    callback: navigateToContract,
    label: getActionLabel(),
    icon: isPastOffer(tradeStatus) ? undefined : statusIcons[status],
  }
  return (
    <View>
      <SummaryItem
        title={contractIdToHex(id)}
        {...{ amount, currency, price, icon, theme, action }}
        level={tradeTheme.level}
        date={new Date(paymentMade || creationDate)}
      />

      {unreadMessages > 0 && (
        <ChatMessages
          style={tw`absolute bottom-0 right-0 my-2.5 mx-3`}
          messages={unreadMessages}
          textStyle={[colors[tradeTheme.level], isIOS() ? tw`pt-1 pl-2px` : tw`pl-2px`]}
        />
      )}
    </View>
  )
}
