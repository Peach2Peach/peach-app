import { Fragment } from 'react'
import { View } from 'react-native'
import { SummaryItem } from '../../../components/payment/SummaryItem'
import { ErrorBox, HorizontalLine } from '../../../components/ui'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { isCashTrade } from '../../../utils/paymentMethod'
import { useContractContext } from '../context'
import { isTradeInformationGetter, tradeInformationGetters } from '../helpers'
import { tradeFields } from '../helpers/tradeInfoFields'
import { TradeInfoField } from '../helpers/tradeInformationGetters'

export const TradeDetails = () => {
  const { contract, view } = useContractContext()
  const sections = getTradeInfoFields(contract, view)
  const error = useLocalContractStore((state) => state.contracts[contract.id]?.error)

  return (
    <View style={tw`justify-center gap-4 grow`}>
      {sections.map((fields: TradeInfoField[], index) => (
        <Fragment key={`section-${index}`}>
          <View style={tw`gap-2`}>
            {fields.map((fieldName, fieldIndex) => (
              <TradeDetailField fieldName={fieldName} key={`${fieldName}-${fieldIndex}`} />
            ))}
          </View>
          {index < sections.length - 1 && <HorizontalLine />}
        </Fragment>
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

  if (!information) return null

  return (
    <SummaryItem
      label={i18n(`contract.summary.${fieldName}`)}
      value={
        typeof information === 'string' || typeof information === 'number' ? (
          <SummaryItem.Text
            value={String(information)}
            copyable={view === 'buyer' && !contract.releaseTxId && fieldName !== 'location'}
          />
        ) : (
          information
        )
      }
    />
  )
}

function getTradeInfoFields (
  { paymentMethod, releaseTxId, batchInfo }: Pick<Contract, 'paymentMethod' | 'releaseTxId' | 'batchInfo'>,
  view: ContractViewer,
) {
  const isTradeCompleted = !!releaseTxId || (!!batchInfo && !batchInfo.completed)
  if (view === 'seller') {
    return tradeFields.seller[isTradeCompleted ? 'past' : 'active'][isCashTrade(paymentMethod) ? 'cash' : 'default']
  }

  if (isTradeCompleted) {
    return tradeFields.buyer.past[isCashTrade(paymentMethod) ? 'cash' : 'default']
  }

  return isCashTrade(paymentMethod)
    ? tradeFields.buyer.active.cash
    : tradeFields.buyer.active.default[paymentMethod] || []
}
