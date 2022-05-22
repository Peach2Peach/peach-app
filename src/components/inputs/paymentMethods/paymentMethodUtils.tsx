import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { paymentMethodAllowedForCurrencies, paymentMethodNotYetSelected } from '../../../utils/paymentMethod'
import { Text } from '../../text'

export const getCheckboxItems = (paymentData: PaymentData[], currencies: Currency[]) => paymentData
  .filter(data => paymentMethodAllowedForCurrencies(data.type, currencies))
  .map(data => ({
    value: data.id,
    disabled: !paymentMethodNotYetSelected(data, paymentData),
    display: <View style={tw`flex-row pr-3 -mt-0.5`}>
      <View style={tw`w-3/4 flex-shrink`}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={tw`leading-6`}>
          {(data.id)}
        </Text>
      </View>
    </View>
  }))