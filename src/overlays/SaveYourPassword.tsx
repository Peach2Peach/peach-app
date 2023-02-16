import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import { Headline, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { PrimaryButton } from '../components/buttons'

export default (): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const confirm = () => {
    updateOverlay({ visible: false })
  }

  return (
    <View testID="saveYourPassword" style={tw`flex items-center`}>
      <Headline style={tw`text-white-1`}>{i18n('newUser.saveYourPassword.title')}</Headline>
      <Text style={tw`mt-2 text-center text-white-1`}>
        {i18n('newUser.saveYourPassword.description.1')}
        {'\n\n'}
        {i18n('newUser.saveYourPassword.description.2')}
        <Text style={tw`font-bold text-white-1`}> {i18n('newUser.saveYourPassword.description.3')} </Text>
        {i18n('newUser.saveYourPassword.description.4')}
      </Text>
      <PrimaryButton testID="saveYourPassword-confirm" style={tw`mt-8`} onPress={confirm} narrow>
        {i18n('newUser.saveYourPassword.ok')}
      </PrimaryButton>
    </View>
  )
}
