import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text, TextLink } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'chat'>
type DisputeDisclaimerProps = ComponentProps & {
  navigation: ProfileScreenNavigationProp,
  contractId: Contract['id'],
}

export const DisputeDisclaimer = ({ navigation, contractId, style }: DisputeDisclaimerProps): ReactElement => {
  const raiseDispute = () => navigation.navigate('dispute', { contractId })

  return <View style={style}>
    <Text style={tw`text-center text-sm`}>
      {i18n('chat.disputeDisclaimer.1')}
      <Text style={tw`font-bold text-sm`}> {i18n('chat.disputeDisclaimer.2')} </Text>
      {i18n('chat.disputeDisclaimer.3')}
    </Text>
    <Text>
      <Text style={tw`text-center text-sm`}>{i18n('chat.disputeDisclaimer.4')} </Text>
      <TextLink style={tw`text-grey-1 text-sm`} onPress={raiseDispute}>
        {i18n('chat.disputeDisclaimer.5')}
      </TextLink>
    </Text>
  </View>
}