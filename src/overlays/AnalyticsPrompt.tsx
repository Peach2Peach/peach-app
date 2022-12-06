import React, { ReactElement, useContext } from 'react'
import { Linking, View } from 'react-native'
import { Headline, PrimaryButton, Text } from '../components'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import analytics from '@react-native-firebase/analytics'
import { updateSettings } from '../utils/account'

export default (): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const accept = () => {
    analytics().setAnalyticsCollectionEnabled(true)
    updateSettings(
      {
        enableAnalytics: true,
      },
      true,
    )
    updateOverlay({ content: null, showCloseButton: true })
  }

  const deny = () => {
    analytics().setAnalyticsCollectionEnabled(false)
    updateSettings(
      {
        enableAnalytics: false,
      },
      true,
    )
    updateOverlay({ content: null, showCloseButton: true })
  }

  return (
    <View testID="saveYourPassword" style={tw`flex items-center`}>
      <Headline style={tw`text-white-1`}>{i18n('analytics.request.title')}</Headline>
      <Text style={tw`text-center text-white-1 mt-2`}>
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
      <PrimaryButton style={tw`mt-8`} onPress={accept} narrow>
        {i18n('analytics.request.yes')}
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={deny} narrow>
        {i18n('analytics.request.no')}
      </PrimaryButton>
    </View>
  )
}
