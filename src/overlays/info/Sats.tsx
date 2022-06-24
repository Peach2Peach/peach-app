import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, Text } from '../../components'
import i18n from '../../utils/i18n'
import { PEACHFEE } from '../../constants'

type SatsInfoProps = {
  view: 'buyer' | 'seller'
}

export default ({ view }: SatsInfoProps): ReactElement => <View>
  <Headline style={tw`text-3xl leading-3xl text-white-1`}>
    {i18n('help.sats.title')}
  </Headline>
  <View style={tw`flex justify-center items-center`}>
    <Text style={tw`text-white-1 text-center`}>
      {i18n('help.sats.description.1')}
    </Text>
    <Text style={tw`text-white-1 text-center mt-2`}>
      {i18n('help.sats.description.2')}
    </Text>
    <Text style={tw`text-white-1 text-center mt-2`}>
      {i18n('help.sats.description.3')}
    </Text>
    <Text style={tw`text-white-1 text-center mt-2`}>
      {i18n(`help.sats.fees.${view}`, String(PEACHFEE * 100))}
    </Text>
  </View>
</View>