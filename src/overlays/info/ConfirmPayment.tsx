import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, Text } from '../../components'
import i18n from '../../utils/i18n'

export default (): ReactElement => <View>
  <Headline style={tw`text-3xl leading-3xl text-white-1`}>
    {i18n('help.confirmPayment.title')}
  </Headline>
  <View style={tw`flex justify-center items-center`}>
    <Text style={tw`text-white-1 text-center`}>
      {i18n('help.confirmPayment.description')}
    </Text>
  </View>
</View>