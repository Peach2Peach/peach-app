import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, PremiumSlider, SatsFormat, Text } from '../../../components'
import { SATSINBTC } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type PremiumProps = {
  premium: number,
  setPremium: (premium: number) => void
  identifier: string,
  offer: SellOffer,
  currency: Currency,
  price: number,
}
export default ({ premium, setPremium, identifier, offer, currency, price }: PremiumProps): ReactElement => <View>
  <Headline style={tw`mt-16 mb-2 text-grey-1`}>
    {i18n('sell.price')}
  </Headline>
  <PremiumSlider min={-20} max={20} value={premium}
    update={identifier}
    onChange={value => setPremium(value)}/>
  <View style={tw`text-center mt-4`}>
    <Text style={tw`text-center`}>
      {i18n('form.premium.yousell')} <SatsFormat sats={offer.amount} format="inline" /> {i18n('form.premium.for')}
    </Text>
  </View>
  <View>
    <Text style={tw`text-center`}>
      <Text style={tw`text-peach-1`}>
        {i18n(
          `currency.format.${currency}`,
          String(Math.round((price / SATSINBTC * offer.amount) * (1 + premium / 100) * 10) / 10)
        )} </Text> ({i18n('form.premium.youget')} <Text style={tw`text-peach-1`}>{premium}%</Text> {i18n(premium >= 0 ? 'form.premium.more' : 'form.premium.less')}) { // eslint-disable-line max-len
      }
    </Text>
  </View>
</View>