import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const NetworkFees = (): ReactElement => (
  <View>
    <Text>{i18n('help.networkFees.description.1')}</Text>
    <Text style={tw`mt-2`}>{i18n('help.networkFees.description.2')}</Text>
  </View>
)
