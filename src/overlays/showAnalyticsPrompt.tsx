import React, { ReactElement } from 'react'
import { Linking, View } from 'react-native'
import { Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import analytics from '@react-native-firebase/analytics'
import { updateSettings } from '../utils/account'

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

  const AnalyticsPrompt = (): ReactElement => (
    <View testID="saveYourPassword" style={tw`flex items-center`}>
      <Text style={tw` text-white-1 mt-2`}>
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

  updateOverlay({
    title: i18n('analytics.request.title'),
    content: <AnalyticsPrompt />,
    visible: true,
    action1: accept,
    action1Label: i18n('analytics.request.yes'),
    action1Icon: 'checkSquare',
    action2: deny,
    action2Label: i18n('analytics.request.no'),
    action2Icon: 'xSquare',
    level: 'APP',
  })
}
