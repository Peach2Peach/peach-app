import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text, TextLink } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Navigation } from '../../../utils/navigation'

type DisputeDisclaimerProps = ComponentProps & {
  navigation: Navigation,
  contract: Contract,
}

export const DisputeDisclaimer = ({ navigation, contract, style }: DisputeDisclaimerProps): ReactElement => {
  const raiseDispute = () => navigation.navigate('dispute', { contractId: contract.id })

  return <View style={style}>
    <Text style={tw`text-center text-sm`}>
      {i18n('chat.disputeDisclaimer.1')}
      <Text style={tw`font-bold text-sm`}> {i18n('chat.disputeDisclaimer.2')} </Text>
      {i18n('chat.disputeDisclaimer.3')}
    </Text>
    {!contract.disputeActive && contract.paymentMethod !== 'cash'
      ? <Text style={tw`text-center`}>
        <Text style={tw`text-center text-sm`}>{i18n('chat.disputeDisclaimer.4')} </Text>
        <TextLink style={tw`text-grey-1 text-sm`} onPress={raiseDispute}>
          {i18n('chat.disputeDisclaimer.5')}
        </TextLink>
      </Text>
      : null
    }
  </View>
}