
import React, { ReactElement, useState } from 'react'
import { View, ViewStyle } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { Headline, Text } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow } from '../../utils/layoutUtils'
import { thousands } from '../../utils/stringUtils'

interface MatchProps {
  match: Match,
  style?: ViewStyle|ViewStyle[]
}

/**
 * @description Component to display a match
 * @param match the match
 * @example
 * <Match match={match} />
 */
export const Match = ({ match, style }: MatchProps): ReactElement => {
  const [selectedCurrency, setSelectedCurrency] = useState(Object.keys(match.prices)[0] as Currency)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(match.paymentMethods[0])

  return <Shadow {...mildShadow} viewStyle={[tw`w-full border border-grey-4 rounded bg-white-1`, style]}>
    <View style={tw`p-4`}>
      <Text>{match.user.id.substring(0, 8)} {match.user.rating ? match.user.rating : null}</Text>
      <View style={tw`flex-row border-t border-grey-4`}>
        <View style={tw`w-1/2`}>
          <Headline style={tw`text-lg text-left`}>{i18n('price')}</Headline>
          <Text>{i18n(`currency.format.${selectedCurrency}`, String(match.prices[selectedCurrency]))}</Text>
          {!match.kyc
            ? <Headline style={tw`text-lg text-left`}>{i18n('kycFree')}</Headline>
            : null
          }
        </View>
        <View style={tw`w-1/2`}>
          <Headline style={tw`text-lg text-left`}>{i18n('payment')}</Headline>
          <Text>{i18n(`paymentMethod.${selectedPaymentMethod}`)}</Text>
        </View>
      </View>
    </View>
  </Shadow>
}

export default Match