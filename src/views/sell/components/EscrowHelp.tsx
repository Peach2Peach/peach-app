import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, Text } from '../../../components'
import { PEACHFEE } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/stringUtils'

type EscrowHelpProps = {
  fees: number
}
export default ({ fees }: EscrowHelpProps): ReactElement => <View>
  <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
    {i18n('escrow.help.title')}
  </Headline>
  <Text style={tw`text-center text-white-1 mt-3`}>
    {i18n('escrow.help.description.intro')}
  </Text>
  <Text style={tw`text-center text-white-1`}>
    {i18n('escrow.help.description.1')}
  </Text>
  <Text style={tw`text-center text-white-1`}>
    {i18n('escrow.help.description.2', String(PEACHFEE), thousands(fees))}
  </Text>
</View>