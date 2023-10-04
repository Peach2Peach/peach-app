import { View } from 'react-native'
import { SummaryItem } from '../../../components/payment/paymentDetailTemplates/SummaryItem'
import { Text } from '../../../components/text'
import { useSettingsStore } from '../../../store/settingsStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { getTradeActionStatus, getTradeActionStatusText } from '../helpers'

export const TradeStatusInfo = () => {
  const { contract, view } = useContractContext()
  const isPeachWalletActive = useSettingsStore((state) => state.peachWalletActive)
  return (
    <View>
      <SummaryItem label={i18n('amount')} value={<SummaryItem.Text value={String(contract.amount)} />} />
      <SummaryItem
        label={i18n('contract.summary.status')}
        value={<SummaryItem.Text value={getTradeActionStatus(contract, view)} />}
      />

      <Text style={[tw`body-s`, tw.md`body-m`]}>{getTradeActionStatusText(contract, view, isPeachWalletActive)}</Text>
    </View>
  )
}
