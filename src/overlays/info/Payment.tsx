import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, Text } from '../../components'
import i18n from '../../utils/i18n'

export default (): ReactElement => <View>
  <Headline style={tw`text-3xl leading-3xl text-white-1`}>
    {i18n('help.payment.title')}
  </Headline>
  <View style={tw`flex items-center justify-center`}>
    <Text style={tw`text-center text-white-1`}>
      {i18n('help.payment.description.1')}
    </Text>
    <Text style={tw`mt-2 text-center text-white-1`}>
      {i18n('help.payment.description.2')}
    </Text>
  </View>
</View>