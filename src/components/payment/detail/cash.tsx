import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

import { Headline, Text } from '../../text'

export const GeneralPaymentDetails = (): ReactElement => <View>
  <Headline style={tw`text-grey-2 normal-case mt-4`}>
    {i18n('contract.payment.at')}
  </Headline>
  <Text style={tw`text-center text-grey-2`}>
    location agreed in chat
  </Text>
</View>

export default GeneralPaymentDetails