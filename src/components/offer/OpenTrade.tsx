import { useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getPaymentDataByMethod } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { CashTradeDetails } from '../payment/paymentDetailTemplates/CashTradeDetails'
import { paymentDetailTemplates } from '../payment/paymentDetailTemplates'
import { Text } from '../text'
import { ErrorBox } from '../ui'
import { TradeSummaryProps } from './TradeSummary'
import { TradeStatus } from './TradeStatus'
import { TradeAmount } from './TradeAmount'
import { TradeStuffSeparator } from './TradeStuffSeparator'
import { TradeStuff } from './TradeStuff'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { DisputeStatus } from './DisputeStatus'

const shouldShowDisputeStatus = (contract: Contract): contract is Contract & { disputeWinner: 'buyer' | 'seller' } =>
  ['confirmPaymentRequired', 'releaseEscrow'].includes(contract.tradeStatus) && !!contract.disputeWinner

export const OpenTrade = ({ contract, view }: TradeSummaryProps) => {
  const storedPaymentData = useMemo(
    () =>
      contract.paymentData
        ? getPaymentDataByMethod(contract.paymentMethod, hashPaymentData(contract.paymentData))
        : null,
    [contract],
  )

  const PaymentTo
    = (!storedPaymentData || view === 'buyer') && contract.paymentMethod
      ? paymentDetailTemplates[contract.paymentMethod]
      : null
  return (
    <View>
      <TradeStatus style={tw`mt-4`} {...contract} />
      {shouldShowDisputeStatus(contract) ? (
        <DisputeStatus winner={contract.disputeWinner} view={view} />
      ) : (
        <>
          <TradeAmount {...contract} isBuyer={view === 'buyer'} />
          {isCashTrade(contract.paymentMethod) && view === 'buyer' && <CashTradeDetails {...contract} />}
          {!!contract.paymentData && !!PaymentTo && <PaymentTo {...contract} copyable={view === 'buyer'} />}
          {view === 'seller'
            && !!storedPaymentData
            && (isCashTrade(contract.paymentMethod) ? (
              <CashTradeDetails {...contract} />
            ) : (
              <View style={tw`flex-row items-start mt-[2px]`}>
                <Text style={[tw`text-black-2 w-25`, contract.disputeActive && tw`text-error-light`]}>
                  {i18n('contract.payment.to')}
                </Text>
                <View style={tw`flex-row items-center flex-1`}>
                  <Text style={[tw`flex-wrap leading-normal subtitle-1`, contract.disputeActive && tw`text-error-dark`]}>
                    {storedPaymentData.label}
                  </Text>
                </View>
              </View>
            ))}
          {!contract.paymentData && contract.error === 'DECRYPTION_ERROR' && (
            <ErrorBox style={tw`mt-[2px]`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
          )}
        </>
      )}

      <TradeStuffSeparator {...contract} style={tw`mt-4`} />
      <TradeStuff contract={contract} style={tw`justify-start mt-6px`} />
    </View>
  )
}
