import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { APPLINKS } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ProfileOverview } from '../../views/publicProfile/components'
import { paymentDetailTemplates } from '../payment'
import PeachScrollView from '../PeachScrollView'
import { PriceFormat, Text } from '../text'
import { CopyAble, HorizontalLine } from '../ui'
import { Escrow } from './Escrow'
import { PaymentMethod } from './PaymentMethod'
import { TradeSummaryProps } from './TradeSummary'

export const OpenTradeBuyer = ({ contract }: TradeSummaryProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null
  const appLink = APPLINKS[contract.paymentMethod]

  return (
    <View style={[tw`h-full`, tw.md`h-auto`]}>
      <ProfileOverview user={contract.seller} clickableID />
      <HorizontalLine style={tw`mt-7 bg-black-5`} />
      <PeachScrollView style={tw`flex-shrink`} showsVerticalScrollIndicator={false}>
        <View style={tw`flex-row items-center justify-between mt-6`}>
          <Text style={tw`text-black-2`}>{i18n('contract.youShouldPay')}</Text>
          <View style={tw`flex-row items-center`}>
            <PriceFormat style={tw`subtitle-1`} amount={contract.price} currency={contract.currency} />
            <CopyAble value={contract.price.toFixed(2)} style={tw`ml-2`} />
          </View>
        </View>
        <View style={tw`flex-row items-center justify-between mt-4`}>
          <Text style={tw`text-black-2`}>
            {i18n(contract.paymentMethod.includes('cash') ? 'contract.summary.in' : 'contract.summary.via')}
          </Text>
          <PaymentMethod paymentMethod={contract.paymentMethod} showLink={!!appLink} />
        </View>

        {!!contract.paymentData && !!PaymentTo && (
          <PaymentTo
            style={tw`mt-4`}
            paymentData={contract.paymentData}
            country={contract.country}
            appLink={appLink?.appLink}
            fallbackUrl={appLink?.url}
            copyable
          />
        )}

        {(!!contract.escrow || !!contract.releaseTxId) && (
          <View style={tw`mt-6`}>
            <HorizontalLine style={tw`bg-black-5`} />
            <Escrow style={tw`mt-6`} contract={contract} />
          </View>
        )}
      </PeachScrollView>
    </View>
  )
}
