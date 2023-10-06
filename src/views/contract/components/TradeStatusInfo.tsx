import { View } from 'react-native'
import { HorizontalLine } from '../../../components'
import { SummaryItem } from '../../../components/payment/paymentDetailTemplates/SummaryItem'
import { Text } from '../../../components/text'
import { useSettingsStore } from '../../../store/settingsStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { getTradeActionStatusText, tradeInformationGetters } from '../helpers'

export const TradeStatusInfo = () => {
  const { contract, view } = useContractContext()
  const isPeachWalletActive = useSettingsStore((state) => state.peachWalletActive)
  return (
    <View style={tw`justify-center gap-4 grow`}>
      <SummaryItem
        label={i18n(`contract.summary.${view === 'buyer' ? 'seller' : 'buyer'}`)}
        value={tradeInformationGetters[view === 'buyer' ? 'seller' : 'buyer'](contract)}
      />
      <HorizontalLine />
      <Text style={[tw.md`body-l`]}>{getTradeActionStatusText(contract, view, isPeachWalletActive)}</Text>
    </View>
  )
}
