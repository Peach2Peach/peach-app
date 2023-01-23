import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Button, Headline, Icon, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'

type Props = {
  contractId: Contract['id']
}

export default ({ contractId }: Props): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ content: null, showCloseButton: true })
  }

  const goToContract = () => {
    navigation.replace('contract', { contractId })
    closeOverlay()
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('matchAccepted.title')}</Headline>
      <View style={tw`flex items-center mt-3`}>
        <View style={tw`flex items-center justify-center w-16 h-16 rounded-full bg-green`}>
          <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color as string} />
        </View>
      </View>
      <Text style={tw`mt-5 text-center text-white-1`}>
        {i18n('matchAccepted.description.1')}
        {'\n\n'}
        {i18n('matchAccepted.description.2')}
      </Text>
      <View style={tw`flex items-center justify-center mt-5`}>
        <Button title={i18n('goToMatch')} secondary={true} wide={false} onPress={goToContract} />
        <Button title={i18n('later')} style={tw`mt-2`} tertiary={true} wide={false} onPress={closeOverlay} />
      </View>
    </View>
  )
}
