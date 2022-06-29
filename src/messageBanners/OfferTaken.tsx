import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const OfferTaken = (): ReactElement => <View>
  <Headline style={tw`text-white-1 text-lg normal-case`}>{i18n('OFFER_TAKEN.title')}</Headline>
  <Text style={tw`text-white-1 text-center mt-1`}>
    {i18n('OFFER_TAKEN.text.1')}
    {'\n'}
    {i18n('OFFER_TAKEN.text.2')}
  </Text>
</View>