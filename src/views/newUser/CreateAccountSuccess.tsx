import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../components'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export default (): ReactElement => (
  <View style={tw`h-full flex justify-center items-center`}>
    <Text style={tw`h4 text-center text-primary-background-light`}>{i18n('newUser.title.accountCreated')}</Text>
    <Text style={tw`body-l text-center text-primary-background-light`}>{i18n('newUser.welcome')}</Text>
    <Icon id="userCheck" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
  </View>
)
