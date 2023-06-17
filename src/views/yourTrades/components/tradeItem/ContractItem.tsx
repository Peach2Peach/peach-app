import { View, ViewStyle } from 'react-native'
import { StatusCard } from '../../../../components/lists/StatusCard'
import tw from '../../../../styles/tailwind'
import { contractIdToHex } from '../../../../utils/contract'
import { isIOS } from '../../../../utils/system'
import { useNavigateToContract } from '../../hooks/useNavigateToContract'
import { TradeTheme } from '../../utils/getThemeForTradeItem'
import { ChatMessages } from '../ChatMessages'
import { getAction, getLevel } from './utils'

const colors: Record<SummaryItemLevel, ViewStyle> = {
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
  theme: 'light' | undefined
}

export const ContractItem = ({ contractSummary, tradeTheme, icon, theme }: Props) => {
  const { tradeStatus, paymentMade, creationDate, id, unreadMessages } = contractSummary
  const navigateToContract = useNavigateToContract(contractSummary)
  const status = tradeTheme.level === 'WAITING' ? 'waiting' : tradeStatus

  return (
    <View>
      <StatusCard
        title={contractIdToHex(id)}
        level={getLevel(tradeTheme)}
        date={new Date(paymentMade || creationDate)}
        action={getAction(contractSummary, navigateToContract, status)}
        {...{ ...contractSummary, icon, theme }}
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
