import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Headline, Text } from '../components'
import i18n from '../utils/i18n'
import { StackNavigationProp } from '@react-navigation/stack'
import { OverlayContext } from '../contexts/overlay'
import { contractIdToHex } from '../utils/contract'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'dispute'>

type RaiseDisputeSuccessProps = {
  message: string,
  contractId: Contract['id'],
  navigation: ProfileScreenNavigationProp,
}

export default ({ message, contractId, navigation }: RaiseDisputeSuccessProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    navigation.navigate('contract', { contractId })
    updateOverlay({ content: null, showCloseButton: true })
  }
  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('dispute.startedOverlay.title')}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      <Text style={tw`text-white-1 text-center`}>
        {i18n('dispute.startedOverlay.description.1', contractIdToHex(contractId))}
      </Text>
      <Text style={tw`text-white-1 text-center mt-2`}>
        {i18n('dispute.startedOverlay.description.2')}
      </Text>
      <Text style={tw`text-white-1 italic text-center mt-2`}>
        {message}
      </Text>
      <Text style={tw`text-white-1 text-center mt-2`}>
        {i18n('dispute.startedOverlay.description.3')}
      </Text>
    </View>
    <Button
      style={tw`mt-6`}
      title={i18n('close')}
      secondary={true}
      wide={false}
      onPress={closeOverlay}
    />
  </View>
}