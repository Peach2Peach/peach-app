import React from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const PaymentMethodsHelp = (
  <>
    <Text>{i18n('help.paymentMethods.description.1')}</Text>
    <View style={tw`flex-row mt-2 items-center`}>
      <View style={tw`flex-shrink`}>
        <Text>{i18n('help.paymentMethods.description.2')}</Text>
      </View>
      <Icon style={tw`w-7 h-7 mx-3`} id="userCheck" color={tw`text-black-1`.color} />
    </View>
  </>
)
