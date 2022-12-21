import React, { ReactElement } from 'react'
import { Linking, View } from 'react-native'
import { Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import analytics from '@react-native-firebase/analytics'
import { updateSettings } from '../utils/account'

const AnalyticsPrompt = (): ReactElement => (
  <View testID="saveYourPassword" style={tw`flex items-center`}>
    <Text style={tw`text-white-1 mt-2`}>
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
export const showAnalyticsPrompt = (updateOverlay: Function) => {
  const accept = () => {
    analytics().setAnalyticsCollectionEnabled(true)
    updateSettings(
      {
        enableAnalytics: true,
      },
      true,
    )
    updateOverlay({ visible: false })
  }

  const deny = () => {
    analytics().setAnalyticsCollectionEnabled(false)
    updateSettings(
      {
        enableAnalytics: false,
      },
      true,
    )
    updateOverlay({ visible: false })
  }

  updateOverlay({
    title: i18n('analytics.request.title'),
    content: <AnalyticsPrompt />,
    visible: true,
    action1: {
      callback: accept,
      label: i18n('analytics.request.yes'),
      icon: 'checkSquare',
    },
    action2: {
      callback: deny,
      label: i18n('analytics.request.no'),
      icon: 'xSquare',
    },
    level: 'APP',
  })
}
