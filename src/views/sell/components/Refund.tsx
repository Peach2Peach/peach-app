import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Button, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement => <View style={tw`flex justify-center items-center`}>
  <Text>
    {i18n('error.WRONG_FUNDING_AMOUNT')}
  </Text>
  <Button
    style={tw`mt-6`}
    wide={false}
    onPress={() => {}} // TODO add refunding logic
    title={i18n('refund')}
  />
</View>