import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { UserInfo } from '../matches/components'
import { PaymentMethod } from '../matches/PaymentMethod'
import { SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'
import { Escrow } from './Escrow'
import { TradeSummaryProps } from './TradeSummary'

const CompletedTradeDetails = ({ currency, price, amount, paymentMethod }: Contract) => (
  <View>
    <View style={tw`flex-row justify-between`}>
      <Text style={tw`text-black-2`}>{i18n('contract.summary.youPaid')}</Text>
      <Text style={tw`subtitle-1`}>
        {currency} {price.toLocaleString()}
      </Text>
    </View>
    <View style={tw`flex-row justify-between my-3`}>
      <Text style={tw`text-black-2`}>{i18n('contract.summary.for')}</Text>
      <SatsFormat sats={amount} style={tw`subtitle-1`} bitcoinLogoStyle={tw`w-4 h-4 mr-1`} satsStyle={tw`body-s`} />
    </View>
    <View style={tw`flex-row justify-between`}>
      <Text style={tw`text-black-2`}>{i18n('contract.summary.via')}</Text>
      <PaymentMethod paymentMethodName={paymentMethod} />
    </View>
  </View>
)

const CanceledTradeDetails = ({ amount, style }: Contract & ComponentProps) => (
  <SatsFormat
    sats={amount}
    style={tw`subtitle-1`}
    containerStyle={style}
    bitcoinLogoStyle={tw`w-4 h-4 mr-1`}
    satsStyle={tw`body-s`}
  />
)

export const ClosedTrade = ({ contract, view }: TradeSummaryProps): ReactElement => {
  const tradingPartner = view === 'seller' ? contract.buyer : contract.seller
  return (
    <View>
      <UserInfo user={tradingPartner} />

      <HorizontalLine style={tw`my-6 bg-black-5`} />

      {contract.tradeStatus === 'tradeCanceled' ? (
        <CanceledTradeDetails {...contract} style={tw`self-center`} />
      ) : (
        <CompletedTradeDetails {...contract} />
      )}

      <HorizontalLine style={tw`my-6 bg-black-5`} />

      <Escrow contract={contract} />
    </View>
  )
}
