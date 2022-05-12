import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import LanguageContext from '../../contexts/language'
import { SellOfferSummary, Title } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'

export default ({ offer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)

  useEffect(() => setStepValid(true))

  return <View style={tw`h-full flex-col justify-center px-6`}>
    <Title title={i18n('sell.title')} subtitle={i18n('offer.summary.subtitle')} style={[tw`mb-4`, tw.md`mb-6`]}/>
    <SellOfferSummary offer={offer} style={tw`flex-shrink-0`} />
  </View>
}