import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, Text } from '../../components'
import i18n from '../../utils/i18n'

export default (): ReactElement => (
  <View>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('help.password.title')}</Headline>
    <View style={tw`flex items-center justify-center`}>
      <Text style={tw`text-center text-white-1`}>{i18n('help.password.description.1')}</Text>
      <Text style={tw`mt-4 text-center text-white-1`}>{i18n('help.password.description.2')}</Text>
      <Text style={tw`pl-4 mt-2 text-center text-white-1`}>
        1. {i18n('help.password.description.2.a')}
        {'\n'}
        2. {i18n('help.password.description.2.b')}
        {'\n'}
        3. {i18n('help.password.description.2.c')}
      </Text>
      <Text style={tw`mt-4 text-center text-white-1`}>{i18n('help.password.description.3')}</Text>
    </View>
  </View>
)
