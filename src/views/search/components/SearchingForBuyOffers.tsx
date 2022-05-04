import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement =>
  <View>
    <Text style={tw`text-center`}>
      {i18n('search.onceConfirmed')}
    </Text>
    <Text style={tw`text-center mt-2`}>
      {i18n('search.youCanCloseTheApp')} {i18n('search.weWillNotifyYou')}
    </Text>
  </View>