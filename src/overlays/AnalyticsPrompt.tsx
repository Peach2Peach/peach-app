import analytics from '@react-native-firebase/analytics'
import React, { ReactElement, useContext } from 'react'
import { Linking, View } from 'react-native'
import { Button, Headline, Text } from '../components'
import { OverlayContext } from '../contexts/overlay'
import { useUserDataStore } from '../store'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export default (): ReactElement => {
  const updateSettings = useUserDataStore((state) => state.updateSettings)
  const [, updateOverlay] = useContext(OverlayContext)

  const accept = () => {
    analytics().setAnalyticsCollectionEnabled(true)
    updateSettings({
      enableAnalytics: true,
    })
    updateOverlay({ content: null, showCloseButton: true })
  }

  const deny = () => {
    analytics().setAnalyticsCollectionEnabled(false)
    updateSettings({
      enableAnalytics: false,
    })
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
      <Button style={tw`mt-8`} title={i18n('analytics.request.yes')} secondary={true} wide={false} onPress={accept} />
      <Button style={tw`mt-2`} title={i18n('analytics.request.no')} secondary={true} wide={false} onPress={deny} />
    </View>
  )
}
