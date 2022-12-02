import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Headline, Icon, PrimaryButton, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { Navigation } from '../utils/navigation'

type Props = {
  contractId: Contract['id']
  navigation: Navigation
}

export default ({ contractId, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ content: null, showCloseButton: true })
  }

  const goToContract = () => {
    navigation.navigate({ name: 'contract', merge: false, params: { contractId } })
    closeOverlay()
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('matchAccepted.title')}</Headline>
      <View style={tw`flex items-center mt-3`}>
        <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
          <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
        </View>
      </View>
      <Text style={tw`text-center text-white-1 mt-5`}>
        {i18n('matchAccepted.description.1')}
        {'\n\n'}
        {i18n('matchAccepted.description.2')}
      </Text>
      <View style={tw`flex justify-center items-center mt-5`}>
        <PrimaryButton onPress={goToContract}>{i18n('goToMatch')}</PrimaryButton>
        <PrimaryButton style={tw`mt-2`} onPress={closeOverlay}>
          {i18n('later')}
        </PrimaryButton>
      </View>
    </View>
  )
}
