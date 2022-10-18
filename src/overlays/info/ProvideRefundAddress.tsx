import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Button, Headline, Text } from '../../components'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  const closeOverlay = () => {}
  return (
    <View>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('help.provideRefundAddress.title')}</Headline>
      <View style={tw`flex justify-center items-center`}>
        <Text style={tw`text-white-1 text-center`}>
          {i18n('help.provideRefundAddress.description.1')}
          {'\n\n'}
          {i18n('help.provideRefundAddress.description.1')}
        </Text>
      </View>
      <View style={tw`flex justify-center items-center`}>
        <Button
          style={tw`mt-7`}
          title={i18n('help.provideRefundAddress.close')}
          help={true}
          onPress={closeOverlay}
          wide={false}
        />
      </View>
    </View>
  )
}
