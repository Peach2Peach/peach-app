import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { SummaryItem } from '../../../components/payment/paymentDetailTemplates/SummaryItem'
import { CopyAble, ErrorBox } from '../../../components/ui'
import { tradeInformationGetters, isTradeInformationGetter, getTradeInfoFields } from '../helpers'
import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
import { useContractContext } from '../context'
import { Icon } from '../../../components'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'

const getTradeDetailsIcon = (shouldShowCopyable: boolean, shouldShowCashIcon: boolean, information: string) =>
  shouldShowCopyable ? (
    <CopyAble value={information} style={[tw`w-4 h-4`, tw.md`w-5 h-5`]} />
  ) : shouldShowCashIcon ? (
    <Icon style={tw`w-4 h-4`} id="arrowDown" color={tw`text-primary-main`.color} />
  ) : undefined

export const TradeDetails = () => {
  const { contract, view } = useContractContext()
  const fields = getTradeInfoFields(contract, view)
  const shouldBlur = isPaymentTooLate(contract)

  return (
    <View>
      {fields.map((fieldName, index) => {
        const label = i18n(`contract.summary.${fieldName}`)
        const information = isTradeInformationGetter(fieldName)
          ? tradeInformationGetters[fieldName](contract)
          : contract.paymentData?.[fieldName]
        if (!information && fieldName !== 'reference') return null
        const props
          = typeof information === 'number'
            ? { label, information, isBitcoinAmount: true as const }
            : !information
              ? { label, information: 'none', isAvailable: false }
              : { label, information }
        return (
          <SummaryItem
            {...props}
            shouldBlur={shouldBlur}
            isDisputeActive={contract.disputeActive}
            icon={getTradeDetailsIcon(
              view === 'buyer' && !contract.releaseTxId && !isCashTrade(contract.paymentMethod),
              isCashTrade(contract.paymentMethod) && fieldName === 'location',
              String(information),
            )}
            key={`${fieldName}-${index}`}
          />
        )
      })}
      {!contract.paymentData && contract.error === 'DECRYPTION_ERROR' && (
        <ErrorBox style={tw`mt-[2px]`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
      )}
    </View>
  )
}
