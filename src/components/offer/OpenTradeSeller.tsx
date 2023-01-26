import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getPaymentDataByMethod } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { ProfileOverview } from '../../views/publicProfile/components'
import { paymentDetailTemplates } from '../payment'
import PeachScrollView from '../PeachScrollView'
import { PriceFormat, Text } from '../text'
import { HorizontalLine } from '../ui'
import { Escrow } from './Escrow'
import { PaymentMethod } from './PaymentMethod'
import { TradeSummaryProps } from './TradeSummary'

export const OpenTradeSeller = ({ contract }: TradeSummaryProps): ReactElement => {
  const storedPaymentData = useMemo(
    () =>
      contract.paymentData
        ? getPaymentDataByMethod(contract.paymentMethod, hashPaymentData(contract.paymentData))
        : null,
    [contract],
  )

  const PaymentTo = !storedPaymentData && contract.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  return (
    <View style={tw`h-full`}>
      <ProfileOverview user={contract.seller} />
      <HorizontalLine style={tw`mt-7`} />
      <PeachScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`flex-row justify-between items-center mt-6`}>
          <Text style={tw`text-black-2`}>{i18n('contract.willPayYou')}</Text>
          <View style={tw`flex-row items-center`}>
            <PriceFormat style={tw`subtitle-1`} amount={contract.price} currency={contract.currency} />
          </View>
        </View>
        <View style={tw`flex-row justify-between items-center mt-4`}>
          <Text style={tw`text-black-2`}>
            {i18n(contract.paymentMethod.includes('cash') ? 'contract.summary.in' : 'contract.summary.via')}
          </Text>
          <PaymentMethod paymentMethod={contract.paymentMethod} showLink={false} />
        </View>

        {storedPaymentData && (
          <View style={tw`flex-row justify-between items-center mt-4`}>
            <Text style={tw`text-black-2`}>{i18n('contract.payment.to')}</Text>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`subtitle-1`}>{storedPaymentData.label}</Text>
            </View>
          </View>
        )}
        {!!contract.paymentData && !!PaymentTo && (
          <PaymentTo style={tw`mt-4`} paymentData={contract.paymentData} country={contract.country} copyable={false} />
        )}

        {(!!contract.escrow || !!contract.releaseTxId) && (
          <View style={tw`mt-6`}>
            <HorizontalLine />
            <Escrow style={tw`mt-6`} contract={contract} view={''} />
          </View>
        )}
      </PeachScrollView>
    </View>
  )
}
