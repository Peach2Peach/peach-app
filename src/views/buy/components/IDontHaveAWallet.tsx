import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement => <View>
  <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
    {i18n('iDontHaveAWallet.title')}
  </Headline>
  <Text style={tw`text-center text-white-1 mt-3`}>
    {i18n('iDontHaveAWallet.description')}
  </Text>
</View>