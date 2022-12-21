import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Text } from '../../components'
import i18n from '../../utils/i18n'

export default (): ReactElement => (
  <View>
    <Text style={tw`text-white-1`}>{i18n('help.networkFees.description.1')}</Text>
    <Text style={tw`text-white-1 mt-2`}>{i18n('help.networkFees.description.2')}</Text>
  </View>
)
