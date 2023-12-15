import { View } from 'react-native'
import { Text } from '../../../components/text'
import { HorizontalLine } from '../../../components/ui/HorizontalLine'
import { useSettingsStore } from '../../../store/settingsStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { tradeInformationGetters } from '../helpers'
import { getBuyerStatusText } from '../helpers/getBuyerStatusText'
import { getSellerStatusText } from '../helpers/getSellerStatusText'
import { SummaryItem } from './SummaryItem'

export const TradeStatusInfo = () => {
  const { contract, view } = useContractContext()
  const isPeachWalletActive = useSettingsStore((state) => state.peachWalletActive)
  return (
    <View style={tw`justify-center gap-5 grow`}>
      <SummaryItem
        label={i18n(`contract.summary.${view === 'buyer' ? 'seller' : 'buyer'}`)}
        value={tradeInformationGetters[view === 'buyer' ? 'seller' : 'buyer'](contract)}
      />
      <HorizontalLine />
      <Text style={[tw`md:body-l`]}>{getTradeActionStatusText(contract, view, isPeachWalletActive)}</Text>
    </View>
  )
}

function getTradeActionStatusText (contract: Contract, view: ContractViewer, isPeachWalletActive: boolean) {
  return view === 'buyer' ? getBuyerStatusText(contract) : getSellerStatusText(contract, isPeachWalletActive)
}
