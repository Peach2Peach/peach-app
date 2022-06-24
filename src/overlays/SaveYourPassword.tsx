import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import { Button, Headline, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'

export default (): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const confirm = () => {
    updateOverlay({ content: null, showCloseButton: true })
  }

  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-white-1`}>
      {i18n('newUser.saveYourPassword.title')}
    </Headline>
    <Text style={tw`text-center text-white-1 mt-2`}>
      {i18n('newUser.saveYourPassword.description.1')}
      {'\n\n'}
      {i18n('newUser.saveYourPassword.description.2')}
      <Text style={tw`font-bold text-white-1`}> {i18n('newUser.saveYourPassword.description.3')} </Text>
      {i18n('newUser.saveYourPassword.description.4')}
    </Text>
    <Button
      style={tw`mt-8`}
      title={i18n('newUser.saveYourPassword.ok')}
      secondary={true}
      wide={false}
      onPress={confirm}
    />
  </View>
}