import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

import { Headline, Icon } from '../components'
import i18n from '../utils/i18n'

export default (): ReactElement => (
  <View style={tw`flex items-center`}>
    <Headline style={tw`text-3xl text-center text-white-1 font-baloo leading-3xl`}>{i18n('success')}</Headline>
    <View style={tw`flex items-center justify-center w-16 h-16 rounded-full bg-green`}>
      <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
    </View>
  </View>
)
