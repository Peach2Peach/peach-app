import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, PrimaryButton, Text } from '../../components'
import i18n from '../../utils/i18n'

export default (): ReactElement => (
  <View>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('help.provideRefundAddress.title')}</Headline>
    <View style={tw`flex items-center justify-center`}>
      <Text style={tw`text-center text-white-1`}>
        {i18n('help.provideRefundAddress.description.1')}
        {'\n\n'}
        {i18n('help.provideRefundAddress.description.1')}
      </Text>
    </View>
    <PrimaryButton style={tw`flex items-center justify-center mt-7`} narrow>
      {i18n('help.provideRefundAddress.close')}
    </PrimaryButton>
  </View>
)
