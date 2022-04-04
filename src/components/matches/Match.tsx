
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { Button, Headline, Text } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow } from '../../utils/layout'
import LanguageContext from '../inputs/LanguageSelect'

type MatchProps = ComponentProps & {
  match: Match,
}

/**
 * @description Component to display a match
 * @param match the match
 * @example
 * <Match match={match} />
 */
export const Match = ({ match, style }: MatchProps): ReactElement => {
  useContext(LanguageContext)

  const [selectedCurrency, setSelectedCurrency] = useState(Object.keys(match.prices)[0] as Currency)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(match.paymentMethods[0])

  useEffect(() => {
    setSelectedCurrency('EUR')
  }, [])

  return <Shadow {...mildShadow} viewStyle={[tw`border border-grey-4 rounded bg-white-1`, style]}>
    {match.matched
      ? <View style={[
        tw`absolute w-full h-full top-0 left-0 z-10`,
        tw`flex items-center justify-between pt-9 pb-5 bg-peach-translucent`
      ]}>
        <Headline style={tw`text-white-2`}>
          {i18n('search.waitingForSeller')}
        </Headline>
        <Button
          tertiary={true}
          wide={false}
          title={i18n('neverMind')}
        />
      </View>
      : null
    }
    <View style={[
      tw`p-4`,
      match.matched ? tw`opacity-20` : {},
    ]}>
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