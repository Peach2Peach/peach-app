import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Card, Headline, HorizontalLine, SatsFormat, Selector, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { unique } from '../../utils/array'

export default ({ offer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)

  useEffect(() => setStepValid(true))

  return <View style={tw`h-full flex-col justify-center px-6`}>
    <Title title={i18n('sell.title')} subtitle={i18n('sell.summary.subtitle')} style={[tw`mb-4`, tw.md`mb-6`]}/>
    <Card style={tw`px-5 py-5 flex-shrink-0`}>
      <Headline style={tw`text-grey-1 normal-case`}>{i18n('sell.summary.youAreSelling')}</Headline>
      <Text style={tw`text-center`}>
        <SatsFormat sats={offer.amount} color={tw`text-black-1`} />
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-1 normal-case mt-4`}>{i18n('sell.summary.for')}</Headline>
      <Text style={tw`text-center`}>
        {i18n('sell.summary.premiumDiscount', String(offer.premium))}
      </Text>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-1 normal-case mt-4`}>{i18n('sell.summary.in')}</Headline>
      <Selector items={offer.currencies.map(c => ({ value: c, display: c }))}
        style={tw`mt-2`}/>
      <HorizontalLine style={tw`mt-4`}/>
      <Headline style={tw`text-grey-1 normal-case mt-4`}>{i18n('sell.summary.via')}</Headline>
      <Selector items={offer.paymentData.filter(unique('type')).map(p => ({ value: p.type, display: p.type }))}
        style={tw`mt-2`} />
    </Card>
  </View>
}