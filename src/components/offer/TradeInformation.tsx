import { shouldShowOpenTrade } from './shouldShowOpenTrade'
import { TradeSeparator } from './TradeSeparator'
import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'
import { getTradeSeparatorIconColor } from './getTradeSeparatorIconColor'
import { getTradeSeparatorText } from './getTradeSeparatorText'
import { View } from 'react-native'
import { TradeSummaryProps } from './TradeSummary'
import tw from '../../styles/tailwind'
import { CanceledTradeDetails } from './CanceledTradeDetails'
import { CompletedTradeDetails } from './CompletedTradeDetails'
import { DisputeStatus } from './DisputeStatus'
import { useMemo } from 'react'
import i18n from '../../utils/i18n'
import { getPaymentDataByMethod } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { CashTradeDetails } from '../payment/paymentDetailTemplates/CashTradeDetails'
import { paymentDetailTemplates } from '../payment/paymentDetailTemplates'
import { Text } from '../text'
import { ErrorBox } from '../ui'
import { TradeAmount } from './TradeAmount'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'

const shouldShowDisputeStatus = (contract: Contract): contract is Contract & { disputeWinner: 'buyer' | 'seller' } =>
  ['confirmPaymentRequired', 'releaseEscrow'].includes(contract.tradeStatus) && !!contract.disputeWinner

export const TradeInformation = ({ contract, view }: TradeSummaryProps) => {
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
      <TradeSeparator
        {...contract}
        iconId={getTradeSeparatorIcon(contract.tradeStatus)}
        iconColor={getTradeSeparatorIconColor(contract.tradeStatus)}
        text={getTradeSeparatorText(contract.tradeStatus)}
      />
      {shouldShowOpenTrade(contract) ? (
        <View>
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
                      <Text
                        style={[tw`flex-wrap leading-normal subtitle-1`, contract.disputeActive && tw`text-error-dark`]}
                      >
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
        </View>
      ) : (
        <>
          {shouldShowDisputeStatus(contract) ? (
            <DisputeStatus winner={contract.disputeWinner} view={view} />
          ) : (
            <>
              {contract.tradeStatus === 'tradeCanceled' ? (
                <CanceledTradeDetails {...contract} style={tw`self-center`} />
              ) : (
                <CompletedTradeDetails {...contract} isBuyer={view === 'buyer'} />
              )}
            </>
          )}
        </>
      )}
    </View>
  )
}
