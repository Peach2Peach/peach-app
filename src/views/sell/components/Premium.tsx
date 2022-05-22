import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, PremiumSlider, SatsFormat, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type PremiumProps = {
  premium: number,
  setPremium: (premium: number) => void
  identifier: string,
  offer: SellOffer,
}
export default ({ premium, setPremium, identifier, offer }: PremiumProps): ReactElement => <View>
  <Headline style={tw`mt-16 mb-2 text-grey-1`}>
    {i18n('sell.price')}
  </Headline>
  <View style={tw`text-center`}>
    <Text style={tw`text-center`}>
      {i18n('form.premium.yousell')} <SatsFormat sats={offer.amount} format="inline" /> {i18n('form.premium.for')}
    </Text>
  </View>
  <View style={tw`flex-row justify-center`}>
    <Text style={tw`text-black-2 w-16 text-right -ml-6 pr-1`}>{premium}%</Text>
    <Text>{i18n(premium >= 0 ? 'form.premium.overMarketPrice' : 'form.premium.underMarketPrice')}</Text>
  </View>
  <PremiumSlider style={tw`mt-4`}
    min={-20} max={20} value={premium}
    update={identifier}
    onChange={value => setPremium(value)}/>
</View>