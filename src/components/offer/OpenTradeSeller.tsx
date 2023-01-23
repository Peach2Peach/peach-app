import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { usePublicProfileNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { paymentDetailTemplates } from '../payment'
import { Headline, Text } from '../text'
import { HorizontalLine } from '../ui'
import { TradeSummaryProps } from './TradeSummary'
import { PaymentMethod } from './PaymentMethod'
import { Escrow } from './Escrow'

export const OpenTradeSeller = ({ contract }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const goToUserProfile = usePublicProfileNavigation(contract.buyer.id)

  return (
    <View>
      <View style={tw`p-5`}>
        <Headline style={tw`normal-case text-grey-2`}>{i18n('buyer')}</Headline>
        <Text onPress={goToUserProfile} style={tw`text-center text-grey-2`}>
          Peach{contract.buyer.id.substring(0, 8)}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('contract.willPayYou')}</Headline>
        <Text style={tw`text-center text-grey-2`}>
          {i18n(`currency.format.${contract.currency}`, contract.price.toFixed(2))}
        </Text>
        <HorizontalLine style={tw`mt-4`} />
        {contract.paymentData && PaymentTo ? (
          <PaymentTo paymentData={contract.paymentData} country={contract.country} />
        ) : null}
        <HorizontalLine style={tw`mt-4`} />
        <PaymentMethod style={tw`mt-4`} paymentMethod={contract.paymentMethod} showLink={false} />

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
