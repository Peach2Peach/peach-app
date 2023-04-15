import { ReactElement, useEffect, useMemo, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getPaymentDataByMethod } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { ChatButton } from '../chat/ChatButton'
import { MatchCardCounterparty } from '../matches/components/MatchCardCounterparty'
import { CashTradeDetails } from '../payment/paymentDetailTemplates/CashTradeDetails'
import { paymentDetailTemplates } from '../payment/paymentDetailTemplates'
import { PeachScrollView } from '../PeachScrollView'
import { PriceFormat, Text } from '../text'
import { ErrorBox, HorizontalLine } from '../ui'
import { Escrow } from './Escrow'
import { PaymentMethod } from './PaymentMethod'
import { TradeSummaryProps } from './TradeSummary'

export const OpenTradeSeller = ({ contract }: TradeSummaryProps): ReactElement => {
  let scroll = useRef<ScrollView>(null).current

  const storedPaymentData = useMemo(
    () =>
      contract.paymentData
        ? getPaymentDataByMethod(contract.paymentMethod, hashPaymentData(contract.paymentData))
        : null,
    [contract],
  )

  const PaymentTo = !storedPaymentData && contract.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null

  useEffect(() => {
    scroll?.flashScrollIndicators()
  }, [scroll])

  return (
    <View style={tw`max-h-full`}>
      <View style={tw`px-7`}>
        <MatchCardCounterparty user={contract.buyer} />
        <HorizontalLine style={tw`mt-7`} />
      </View>
      <PeachScrollView
        scrollRef={(ref) => (scroll = ref)}
        style={tw`flex-shrink`}
        contentContainerStyle={tw`px-7`}
        showsVerticalScrollIndicator
        persistentScrollbar
      >
        <View style={tw`items-start mt-6`}>
          <PaymentMethod
            paymentMethod={contract.paymentMethod.includes('cash.') ? 'cash' : contract.paymentMethod}
            showLink={false}
          />
        </View>
        <View style={tw`flex-row items-center mt-2`}>
          <Text style={tw`text-black-2 w-25`}>{i18n('amount')}</Text>
          <View style={tw`flex-row items-center`}>
            <PriceFormat style={tw`subtitle-1`} amount={contract.price} currency={contract.currency} />
          </View>
        </View>
        {!!storedPaymentData
          && (contract.paymentMethod.includes('cash.') ? (
            <CashTradeDetails contract={contract} />
          ) : (
            <View style={tw`flex-row items-start mt-[2px]`}>
              <Text style={tw`text-black-2 w-25`}>{i18n('contract.payment.to')}</Text>
              <View style={tw`flex-row items-center flex-1`}>
                <Text style={tw`flex-wrap leading-normal subtitle-1`}>{storedPaymentData.label}</Text>
              </View>
            </View>
          ))}
        {!!contract.paymentData && !!PaymentTo && (
          <PaymentTo
            paymentMethod={contract.paymentMethod}
            paymentData={contract.paymentData}
            country={contract.country}
            copyable={false}
          />
        )}
        {!contract.paymentData && contract.error === 'DECRYPTION_ERROR' && (
          <ErrorBox style={tw`mt-[2px]`}>{i18n('contract.paymentData.decyptionFailed')}</ErrorBox>
        )}

        <HorizontalLine style={tw`mt-6`} />
        <View style={tw`flex-row justify-center mt-6`}>
          {(!!contract.escrow || !!contract.releaseTxId) && <Escrow contract={contract} style={tw`mr-3 min-w-24`} />}
          <ChatButton contract={contract} style={tw`min-w-24`} />
        </View>
      </PeachScrollView>
    </View>
  )
}
