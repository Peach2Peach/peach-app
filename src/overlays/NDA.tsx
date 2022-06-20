import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import { Button, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'

export default (): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  return <View style={tw`flex items-center`}>
    <Text style={tw`text-center text-white-1`}>
      {i18n('overlay.nda')}
    </Text>
    <Button
      style={tw`mt-8`}
      title={i18n('overlay.nda.confirm')}
      secondary={true}
      wide={false}
      onPress={closeOverlay}
    />
  </View>
}