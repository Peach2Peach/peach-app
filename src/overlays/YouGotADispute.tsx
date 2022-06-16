import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Headline, Text } from '../components'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { contractIdToHex } from '../utils/contract'
import { acknowledgeDispute } from '../utils/peachAPI/private/contract'
import { MessageContext } from '../contexts/message'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { error } from '../utils/log'
import { StackNavigationProp } from '@react-navigation/stack'
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>


type YouGotADisputeProps = {
  message: string,
  contractId: Contract['id'],
  navigation: NavigationContainerRefWithCurrent<RootStackParamList>|ProfileScreenNavigationProp,
}

// eslint-disable-next-line max-lines-per-function
export default ({ message, contractId, navigation }: YouGotADisputeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [loading, setLoading] = useState(false)


  const closeOverlay = () => {
    navigation.navigate('contract', { contractId })
    updateOverlay({ content: null, showCloseButton: true })
  }
  const submit = async () => {
    setLoading(true)
    const [result, err] = await acknowledgeDispute({
      contractId,
    })
    if (result) {
      setLoading(false)
      if ('push' in navigation) {
        navigation.push('contractChat', { contractId })
      } else {
        navigation.navigate({ name: 'contractChat', merge: false, params: { contractId } })
      }
      closeOverlay()
      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
    setLoading(false)
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
    <View style={tw`flex items-center`}>
      <Button
        style={tw`mt-6`}
        title={loading ? '' : i18n('dispute.startedOverlay.goToDispute')}
        disabled={loading}
        loading={loading}
        secondary={true}
        wide={false}
        onPress={submit}
      />
      <Button
        style={tw`mt-2`}
        title={loading ? '' : i18n('close')}
        disabled={loading}
        loading={loading}
        tertiary={true}
        wide={false}
        onPress={closeOverlay}
      />
    </View>
  </View>
}