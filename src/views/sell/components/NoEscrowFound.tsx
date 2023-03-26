import { ReactElement } from 'react';
import { View } from 'react-native'

import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement => (
  <View style={tw`justify-center h-full`}>
    <Text style={tw`text-center subtitle-1`}>{i18n('escrowNotFound')}</Text>
  </View>
)
