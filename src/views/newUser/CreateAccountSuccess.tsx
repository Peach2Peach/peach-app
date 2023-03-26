import { ReactElement } from 'react';
import { View } from 'react-native'
import { Icon, Text } from '../../components'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export default (): ReactElement => (
  <View style={tw`flex items-center justify-center h-full`}>
    <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.title.accountCreated')}</Text>
    <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.welcome')}</Text>
    <Icon id="userCheck" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
  </View>
)
