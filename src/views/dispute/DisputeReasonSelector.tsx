import { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { OptionButton, PeachScrollView, Text } from '../../components'
import i18n from '../../utils/i18n'
import { useDisputeReasonSelectorSetup } from './hooks/useDisputeReasonSelectorSetup'

export default (): ReactElement => {
  const { availableReasons, setReason } = useDisputeReasonSelectorSetup()

  return (
    <View style={tw`flex-col items-center justify-between h-full px-6 pt-6 pb-10`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow`}>
        <Text style={tw`text-center h6`}>{i18n('contact.whyAreYouContactingUs')}</Text>
        {availableReasons.map((rsn) => (
          <OptionButton key={rsn} onPress={() => setReason(rsn)} style={[tw`w-64 mt-4`]} narrow>
            {i18n(`dispute.reason.${rsn}`)}
          </OptionButton>
        ))}
      </PeachScrollView>
    </View>
  )
}
