import { View } from 'react-native'
import { Icon, Text } from '../../../components'
import { SummaryItem, TextSummaryItem } from '../../../components/payment/paymentDetailTemplates/SummaryItem'
import { CopyAble, ErrorBox } from '../../../components/ui'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import tw from '../../../styles/tailwind'
import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
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

  const shouldBlur = isPaymentTooLate(contract)

  const label = i18n(`contract.summary.${fieldName}`)

  const information = isTradeInformationGetter(fieldName)
    ? tradeInformationGetters[fieldName](contract)
    : contract.paymentData?.[fieldName]

  if (!information && fieldName !== 'reference') return null

  const props
    = typeof information === 'number'
      ? { information, isBitcoinAmount: true as const }
      : !information
        ? { information: 'none', isAvailable: false }
        : { information }

  const isEscrow = undefined
  const isBitcoinAmount = typeof information === 'number'

  return (
    <SummaryItem
      label={
        <Text style={[tw`text-black-2`, tw.md`body-l`]}>
          {isEscrow ? i18n('escrow') : isBitcoinAmount ? i18n('amount') : label}
        </Text>
      }
      value={
        <TextSummaryItem
          {...props}
          shouldBlur={shouldBlur}
          isDisputeActive={contract.disputeActive}
          icon={
            <TradeDetailsIcon
              shouldShowCopyable={view === 'buyer' && !contract.releaseTxId && !isCashTrade(contract.paymentMethod)}
              shouldShowCashIcon={isCashTrade(contract.paymentMethod) && fieldName === 'location'}
              information={String(information)}
            />
          }
        />
      }
    />
  )
}

type TradeDetailsIconProps = {
  shouldShowCopyable: boolean
  shouldShowCashIcon: boolean
  information: string
}
function TradeDetailsIcon ({ shouldShowCopyable, shouldShowCashIcon, information }: TradeDetailsIconProps) {
  return shouldShowCopyable ? (
    <CopyAble value={information} style={[tw`w-4 h-4`, tw.md`w-5 h-5`]} />
  ) : shouldShowCashIcon ? (
    <Icon style={tw`w-4 h-4`} id="arrowDown" color={tw`text-primary-main`.color} />
  ) : null
}
