import { ReactElement, useEffect, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import { APPLINKS } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ChatButton } from '../chat/ChatButton'
import { MatchCardCounterparty } from '../matches/components/MatchCardCounterparty'
import { CashTradeDetails } from '../payment/paymentDetailTemplates/CashTradeDetails'
import { paymentDetailTemplates } from '../payment/paymentDetailTemplates'
import PeachScrollView from '../PeachScrollView'
import { PriceFormat, Text } from '../text'
import { CopyAble, ErrorBox, HorizontalLine } from '../ui'
import { Escrow } from './Escrow'
import { PaymentMethod } from './PaymentMethod'
import { TradeSummaryProps } from './TradeSummary'

export const OpenTradeBuyer = ({ contract }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const appLink = APPLINKS[contract.paymentMethod]
  let scroll = useRef<ScrollView>(null).current

  useEffect(() => {
    scroll?.flashScrollIndicators()
  }, [scroll])

  return (
    <View style={tw`max-h-full`}>
      <View style={tw`mx-7`}>
        <MatchCardCounterparty user={contract.seller} />
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
            showLink={!!appLink}
          />
        </View>
        <View style={tw`flex-row items-center mt-2`}>
          <Text style={tw`text-black-2 w-25`}>{i18n('amount')}</Text>
          <View style={tw`flex-row items-center`}>
            <PriceFormat style={tw`subtitle-1`} amount={contract.price} currency={contract.currency} />
            <CopyAble value={contract.price.toFixed(2)} style={tw`ml-2`} />
          </View>
        </View>
        {contract.paymentMethod.includes('cash.') && <CashTradeDetails contract={contract} />}
        {!!contract.paymentData && !!PaymentTo && (
          <PaymentTo
            paymentData={contract.paymentData}
            paymentMethod={contract.paymentMethod}
            country={contract.country}
            appLink={appLink?.appLink}
            fallbackUrl={appLink?.url}
            copyable
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
