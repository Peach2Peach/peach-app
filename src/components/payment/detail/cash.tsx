import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

import { Headline, Text } from '../../text'

export const CashDetails = (): ReactElement => (
  <View>
    <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('contract.payment.at')}</Headline>
    <Text style={tw`text-center text-grey-2`}>location agreed in chat</Text>
  </View>
)

export default CashDetails
