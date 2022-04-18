
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Headline, Shadow, Text, HorizontalLine } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow } from '../../utils/layout'
import LanguageContext from '../../contexts/language'
import { Selector } from '../inputs'
import { thousands } from '../../utils/string'
import BitcoinContext, { getBitcoinContext } from '../../contexts/bitcoin'
import Medal from '../medal'

type MatchProps = ComponentProps & {
  match: Match,
}

/**
 * @description Component to display a match
 * @param match the match
 * @example
 * <Match match={match} />
 */
// eslint-disable-next-line max-lines-per-function
export const Match = ({ match, style }: MatchProps): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const [selectedCurrency, setSelectedCurrency] = useState(Object.keys(match.prices)[0] as Currency)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(match.paymentMethods[0])
  const { price } = getBitcoinContext()

  useEffect(() => {
    setSelectedCurrency('EUR')
  }, [])

  return <Shadow {...mildShadow} viewStyle={[
    tw`w-full border border-grey-4 rounded-md bg-white-1`,
    match.matched ? tw`border-green` : {},
    style
  ]}>
    {match.matched
      ? <Text style={tw`absolute bottom-full w-full text-center font-baloo text-green text-xs`}>
        {i18n('search.waitingForSeller')}
      </Text>
      : null
    }
    <View style={[
      tw`px-5 pt-6 pb-9`,
      match.matched ? tw`opacity-20` : {},
    ]}>
      <View style={tw`w-full flex-row justify-between`}>
        <View style={tw`px-6`}>
          <Text style={tw`text-lg`}>
            {match.user.id.substring(0, 8)}
          </Text>
          <View style={tw`flex-row justify-between mt-2`}>
            <Medal id="gold" style={tw`w-5 h-4 opacity-50`}/>
            <Medal id="gold" style={tw`w-5 h-4`}/>
            <Medal id="gold" style={tw`w-5 h-4 opacity-50`}/>
          </View>
        </View>
        <View style={tw`px-6`}>
          <Medal id={match.user.rating > 0.9 ? 'gold' : 'silver'} />
        </View>
      </View>
      <HorizontalLine style={tw`mt-4`}/>
      <View style={tw`flex-row justify-center mt-3`}>
        <Text style={tw`font-baloo text-xl leading-xl text-peach-1`}>
          {i18n(`currency.format.${selectedCurrency}`, String(match.prices[selectedCurrency]))}
        </Text>
        <Text style={tw`text-lg leading-lg ml-2`}>
          {i18n('pricePerBitcoin', i18n(`currency.format.${selectedCurrency}`, thousands(Math.round(price))))}
        </Text>
      </View>
      <HorizontalLine style={tw`mt-3`}/>
      <Headline style={tw`mt-4 lowercase text-grey-1`}>
        {i18n('form.currency')}
      </Headline>
      <Selector
        style={tw`mt-4`}
        selectedValue={selectedCurrency}
        items={Object.keys(match.prices).map(c => ({ value: c, display: c }))}
        onChange={c => setSelectedCurrency(c as Currency)}
      />
      <HorizontalLine style={tw`mt-5`}/>
      <Headline style={tw`mt-4 lowercase text-grey-1`}>
        {i18n('form.paymentMethod')}
      </Headline>
      <Selector
        style={tw`mt-4`}
        selectedValue={selectedPaymentMethod}
        items={match.paymentMethods.concat(['giftCard', 'revolut', 'applePay', 'twint', 'wise']).map(p => ({
          value: p,
          display: i18n(`paymentMethod.${p}`)
        }))}
        onChange={c => setSelectedPaymentMethod(c as PaymentMethod)}
      />
      <HorizontalLine style={tw`mt-5`}/>
      {!match.kyc
        ? <Headline style={tw`text-lg text-left`}>{i18n('kycFree')}</Headline>
        : null
      }
    </View>
  </Shadow>
}

export default Match