import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, PrimaryButton, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => updateOverlay({ content: null })

  return (
    <View>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('help.currency.title')}</Headline>
      <View style={tw`flex justify-center items-center`}>
        <Text style={tw`text-white-1 text-center`}>{i18n('help.currency.description')}</Text>
      </View>
      <PrimaryButton style={tw`self-center mt-7`} onPress={closeOverlay} narrow>
        {i18n('close')}
      </PrimaryButton>
    </View>
  )
}
