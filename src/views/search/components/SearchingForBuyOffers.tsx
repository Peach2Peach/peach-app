import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement =>
  <View>
    <Text style={tw`text-center`}>
      {i18n('search.sellOffer.1')}
    </Text>
    <Text style={tw`text-center mt-2`}>
      {i18n('search.sellOffer.2')}
    </Text>
  </View>