import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { APPLINKS } from '../../constants'
import { usePublicProfileNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { paymentDetailTemplates } from '../payment'
import { Headline, Text } from '../text'
import { HorizontalLine } from '../ui'
import { TradeSummaryProps } from './TradeSummary'
import { PaymentMethod } from './PaymentMethod'
import { Escrow } from './Escrow'

export const OpenTradeBuyer = ({ contract }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const goToUserProfile = usePublicProfileNavigation(contract.seller.id)
  const appLink = APPLINKS[contract.paymentMethod]

  return (
    <View style={tw`border rounded border-peach-1`}>
      {contract.paymentMade ? (
        <View style={tw`absolute top-0 left-0 z-20 w-full h-full`} pointerEvents="none">
          <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
          <Text style={tw`absolute w-full text-xs text-center bottom-full font-baloo text-peach-1`}>
            {i18n('contract.payment.made')}
          </Text>
        </View>
      ) : null}
      <View style={tw`p-5`}>
        <Headline style={tw`normal-case text-grey-2`}>{i18n('seller')}</Headline>
        <Text onPress={goToUserProfile} style={tw`text-center text-grey-2`}>
          Peach{contract.seller.id.substring(0, 8)}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('contract.youShouldPay')}</Headline>
        <Text style={tw`text-center text-grey-2`}>
          {i18n(`currency.format.${contract.currency}`, contract.price.toFixed(2))}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        {contract.paymentData && PaymentTo ? (
          <PaymentTo
            paymentData={contract.paymentData}
            country={contract.country}
            appLink={appLink?.appLink}
            fallbackUrl={appLink?.url}
          />
        ) : null}
        <HorizontalLine style={tw`mt-4`} />
        <PaymentMethod style={tw`mt-4`} paymentMethod={contract.paymentMethod} showLink={true} />

        {contract.escrow || contract.releaseTxId ? (
          <View>
            <HorizontalLine style={tw`mt-4`} />
            <Escrow style={tw`mt-4`} contract={contract} view={''} />
          </View>
        ) : null}
      </View>
    </View>
  )
}
