import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Text, TextLink } from '../../../components'
import { MessageContext } from '../../../contexts/message'
import tw from '../../../styles/tailwind'
import { updateSettings } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { textShadow } from '../../../utils/layout'
import { Navigation } from '../../../utils/navigation'

type DisputeDisclaimerProps = ComponentProps & {
  navigation: Navigation,
  contract: Contract,
}

export const DisputeDisclaimer = ({ navigation, contract, style }: DisputeDisclaimerProps): ReactElement => {
  const raiseDispute = () => navigation.navigate('dispute', { contractId: contract.id })
  const [, updateMessage] = useContext(MessageContext)

  return <View style={style}>
    <Text style={tw`text-center text-sm text-white-1`}>
      {i18n('chat.disputeDisclaimer.1')}
      <Text style={tw`font-bold text-sm text-white-1`}> {i18n('chat.disputeDisclaimer.2')} </Text>
      {i18n('chat.disputeDisclaimer.3')}
    </Text>
    {!contract.disputeActive && contract.paymentMethod !== 'cash'
      ? <Text style={tw`text-center text-white-1`}>
        <Text style={tw`text-center text-sm text-white-1`}>{i18n('chat.disputeDisclaimer.4')} </Text>
        <TextLink style={tw`text-white-1 text-sm font-bold`} onPress={raiseDispute}>
          {i18n('chat.disputeDisclaimer.5')}
        </TextLink>
      </Text>
      : null
    }
    <View style={tw`w-full flex-row`}>
      <Text onPress={() => {
        updateSettings({ showDisputeDisclaimer: false }, true)
        updateMessage({ template: undefined, msg: undefined, level: 'ERROR' })
      }
      }
      style={[tw`flex-1 font-baloo text-xs text-white-2 underline`, textShadow]}>
        {i18n('doNotShowAgain').toLocaleUpperCase()}
      </Text>
      <Text onPress={() => updateMessage({ template: undefined, msg: undefined, level: 'ERROR' })}
        style={[tw`flex-1 font-baloo underline text-xs text-white-2 text-right`, textShadow]}>
        {i18n('close').toLocaleUpperCase()}
      </Text>
    </View>
  </View>
}