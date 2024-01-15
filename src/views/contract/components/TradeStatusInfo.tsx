import { View } from 'react-native'
import { PeachText } from '../../../components/text/PeachText'
import { HorizontalLine } from '../../../components/ui/HorizontalLine'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { tradeInformationGetters } from '../helpers'
import { getBuyerStatusText } from '../helpers/getBuyerStatusText'
import { getSellerStatusText } from '../helpers/getSellerStatusText'
import { SummaryItem } from './SummaryItem'

export const TradeStatusInfo = () => {
  const { contract, view } = useContractContext()
  const isPeachWalletActive = useSettingsStore((state) =>
    view === 'buyer' ? state.payoutToPeachWallet : state.refundToPeachWallet,
  )
  return (
    <View style={tw`justify-center gap-5 grow`}>
      <SummaryItem
        label={i18n(`contract.summary.${view === 'buyer' ? 'seller' : 'buyer'}`)}
        value={tradeInformationGetters[view === 'buyer' ? 'seller' : 'buyer'](contract)}
      />
      <HorizontalLine />
      <PeachText style={tw`md:body-l`}>{getTradeActionStatusText(contract, view, isPeachWalletActive)}</PeachText>
    </View>
  )
}

function getTradeActionStatusText (contract: Contract, view: ContractViewer, isPeachWalletActive: boolean) {
  return view === 'buyer' ? getBuyerStatusText(contract) : getSellerStatusText(contract, isPeachWalletActive)
}
