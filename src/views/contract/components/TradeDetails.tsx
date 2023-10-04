import { View } from 'react-native'
import { SummaryItem } from '../../../components/payment/paymentDetailTemplates/SummaryItem'
import { ErrorBox } from '../../../components/ui'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { useContractContext } from '../context'
import { getTradeInfoFields, isTradeInformationGetter, tradeInformationGetters } from '../helpers'
import { TradeInfoField } from '../helpers/tradeInformationGetters'

export const TradeDetails = () => {
  const { contract, view } = useContractContext()
  const fields = getTradeInfoFields(contract, view)
  const error = useLocalContractStore((state) => state.contracts[contract.id]?.error)

  return (
    <View style={tw`gap-2`}>
      {fields.map((fieldName, index) => (
        <TradeDetailField fieldName={fieldName} key={`${fieldName}-${index}`} />
      ))}
      {!contract.paymentData && error === 'DECRYPTION_ERROR' && (
        <ErrorBox style={tw`mt-[2px]`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
      )}
    </View>
  )
}

function TradeDetailField ({ fieldName }: { fieldName: TradeInfoField }) {
  const { contract, view } = useContractContext()

  const information = isTradeInformationGetter(fieldName)
    ? tradeInformationGetters[fieldName](contract)
    : contract.paymentData?.[fieldName]

  if (!information && fieldName !== 'reference') return null

  return (
    <SummaryItem
      label={i18n(`contract.summary.${fieldName}`)}
      value={
        <SummaryItem.Text
          value={String(information)}
          copyable={view === 'buyer' && !contract.releaseTxId && !isCashTrade(contract.paymentMethod)}
        />
      }
    />
  )
}
