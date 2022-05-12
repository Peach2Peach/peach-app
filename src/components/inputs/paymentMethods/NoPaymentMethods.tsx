import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Shadow, Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { mildShadow } from '../../../utils/layout'

export const NoPaymentMethods = (): ReactElement => <Shadow shadow={mildShadow} style={tw`w-full`}>
  <View style={tw`p-5 py-2 bg-white-1 border border-grey-4 rounded`}>
    <Text style={tw`text-center text-grey-2`}>
      {i18n('sell.paymentMethods.empty')}
    </Text>
  </View>
</Shadow>

export default NoPaymentMethods