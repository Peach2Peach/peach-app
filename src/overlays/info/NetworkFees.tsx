import { ReactElement } from 'react'
import { View } from 'react-native'
import { PeachText } from '../../components/text/Text'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const NetworkFees = (): ReactElement => (
  <View>
    <PeachText>{i18n('help.networkFees.description.1')}</PeachText>
    <PeachText style={tw`mt-2`}>{i18n('help.networkFees.description.2')}</PeachText>
  </View>
)
