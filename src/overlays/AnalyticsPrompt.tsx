import React, { ReactElement } from 'react'
import { Linking, View } from 'react-native'
import { Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const AnalyticsPrompt = (): ReactElement => (
  <View testID="saveYourPassword" style={tw`flex items-center`}>
    <Text style={tw`text-white-1`}>
      {i18n('analytics.request.description1')}
      {'\n\n'}
      {i18n('analytics.request.description2')}
      <Text
        style={tw`text-center text-white-1 mt-2 underline`}
        onPress={() => Linking.openURL('https://www.peachbitcoin.com/privacyPolicy.html')}
      >
        {i18n('privacyPolicy').toLocaleLowerCase()}.
      </Text>
      {'\n\n'}
      {i18n('analytics.request.description3')}
    </Text>
  </View>
)
